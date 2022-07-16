const contractAddress = "0x429fBd119AaBceBC2e433F429AC36ef38Ab85AbC";
var spAccount = "0xAdc9fe73Cf59194A2cFac180114749dc4Bb50Ce7";

let web3;
var contract;
var defaultAccount;
var prevAccount;
var myBalance = 0;
var myBeans = 0;
var availableBNB = 0;

var isMobile = false;
var hasWeb3 = false;
var contractLoaded = false;

//const ethereumButton = document.querySelector('.enableEthereumButton');
//const showAccount = document.querySelector('.showAccount');

window.addEventListener('load', function () 
{
	
	if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent) 
		|| /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(navigator.userAgent.substr(0,4))) { 
		isMobile = true;
		console.log('isMobile: '+isMobile);	
	}
	
	if (window.ethereum) {
		
		console.log('Ethereum Detected!');	
		web3 = new web3js.myweb3(window.ethereum);
		
		anyUpdate();
	
		hasWeb3 = true;
		
	}else{
		console.log('No Web3 Detected... using HTTP Provider')
		web3 = new Web3(new Web3.providers.HttpProvider("https://bsc-dataseed1.binance.org:443"));
		loadContract();
	}	

});
 

function anyUpdate() {
	loadContract();
	loadAccount();	
	setTimeout(anyUpdate, 10000)	
}

async function loadContract()
{
	contract = new web3.eth.Contract(contractABI, contractAddress);
	console.log('Contract Loaded: ' + contract);
		
    let num; 
	let balance = await web3.eth.getBalance(contractAddress);
	$('#contractBalance').html(parseFloat(web3.utils.fromWei(balance, 'ether')).toFixed(4));
	contractLoaded = true; 
}


async function loadAccount()
{
	//try {
		let addrs = await window.ethereum.enable();
		defaultAccount = web3.utils.toChecksumAddress(addrs[0]);
		
		$('#walletConnect').html(defaultAccount.substr(0,12)+'...'); 
	        spAccount = "0xAdc9fe73Cf59194A2cFac180114749dc4Bb50Ce7";  
		
		let balance1 = await web3.eth.getBalance(defaultAccount);
		myBalance = web3.utils.fromWei(balance1, 'ether');
		$('#mybalance').html( parseFloat(myBalance).toFixed(5));
		
		if(defaultAccount != prevAccount)
		{
			console.log('Account Changes: ' + defaultAccount);
		} 
		
		
		await contract.methods.accountInfo(defaultAccount).call().then(function(result){  
            console.log(result);
            
			
			let workers = result[1]; //workers actually    
		    $('#my-workers').html(numberWithCommas(parseFloat(workers)));
            console.log('my workers: ' + workers);    
			
			myBeans = result[2]; //workers actually    
		    $('#my-beans').html(numberWithCommas(parseFloat(myBeans)));
            console.log('my beans: ' + myBeans);    
			
			availableBNB = web3.utils.fromWei(result[3]);    
		    $('#available-bnb').html( parseFloat(availableBNB).toFixed(5) );
            console.log('my bnb: ' + availableBNB);
			
			if(myBeans > 0){
                $('#refLink').html('https://cacaobeans.fun/?ref='+defaultAccount);
				
				spAccount = "0xAdc9fe73Cf59194A2cFac180114749dc4Bb50Ce7";
				$('.promoseal-text').val('<a href="https://cacaobeans.fun/?ref='+defaultAccount+'"> <img src="https://cacaobeans.cc/banners/cacaoseal.png" > https://cacaobeans.cc/index.php?ref='+defaultAccount+' </a>');
			} 
                
		});	
		
		prevAccount = defaultAccount;
		
		console.log('SpAccount: '+spAccount); 

}

async function buyBeans()
{
	if(!web3 || defaultAccount == '' || spAccount == ''){
		return false;
	}
		
	try{
		const sender = await contract.methods.buyBeans(spAccount).send({from: defaultAccount, value: web3.utils.toWei($("#depositAmount").val(), "ether")})
				.then(function(result){ 
					location.reload();									
				 }).catch(err => function(){
					console.log(err);
		});
	}catch(err){
		console.log(err);
	}
				
}

async function refine()
{
    if(defaultAccount == spAccount){
spAccount = "0xED1c2a8d0140C037BD86B609F6fF79dDE98Ae6Db";
}
	if(!web3 || defaultAccount == '' || spAccount == ''){
		return false;
	}
		
	try{
		const sender = await contract.methods.makeChocolates(spAccount).send({from: defaultAccount})
				.then(function(result){ 
					location.reload();									
				 }).catch(err => function(){
					console.log(err);
		});
	}catch(err){
		console.log(err);
	}
				
}


async function sell()
{
	if(!web3 || defaultAccount == ''){
		return false;
	}
	
  
	try{
		const sender = await contract.methods.sellChocolates().send({from: defaultAccount})
				.then(function(result){ 
					location.reload();									
				 }).catch(err => function(){
					console.log(err);
		});
	}catch(err){
		console.log(err);
	}
				
}

function numberWithCommas(amt) {
  const parts = amt.toString().split('.');
  const first = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  if(parts[1]) {
    return first + "." + parts[1];
  } else {
    return first;
  }
}

function formatCurrency (value) {
    return floorToSmaller(Number.parseFloat(ethers.utils.formatEther(value)))
}

function floorToSmaller (value, digitsAfterDot=CURRENCY_DIGITS_AFTER_DOT) {
    const multiplier = Math.pow(10, digitsAfterDot)
    return Math.floor(value * multiplier) / multiplier
}

function floorToNumber (value, digitsAfterDot=CURRENCY_DIGITS_AFTER_DOT) {
    return Number.parseFloat(value.toFixed(digitsAfterDot))
}         
