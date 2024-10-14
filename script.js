const slider=document.querySelector(".slider");
const passwordLength=document.querySelector(".number");
const passwordDisplay=document.querySelector(".display");
const copyBtn=document.querySelector(".copyButton");
const copyMsg=document.querySelector(".copyText");
const upperCheck=document.querySelector("#upper");
const lowerCheck=document.querySelector("#lower");
const numberCheck=document.querySelector("#numbers");
const symbolCheck=document.querySelector("#symbols");
let indicator=document.querySelector(".indicatorStrength");
const generateButton=document.querySelector(".generator");
const allCheckBoxes=document.querySelectorAll("input[type=checkbox]")
let strength=document.querySelector(".strengthText");
// module 1
// after adjusting the slider
console.log(slider.value);
slider.addEventListener("input",handleSlider);

function handleSlider(){
    passwordLength.textContent=parseInt(slider.value);
    slider.value=passwordLength.textContent;
    const min=slider.min;
    const max=slider.max;
    let passlen=parseInt(passwordLength.textContent);
    slider.style.background = `linear-gradient(90deg, #795713 ${(((passlen - min) * 100) / (max - min))}%, #ddd ${(((passlen - min) * 100) / (max - min))}%)`;

}

// module 2
// getting random number between two numbers
function getRandom(min,max){
    return Math.floor(Math.random()*max)+min;
}
// getting lower case letter
function getLowerLetter() {
    const lowerLetters = 'abcdefghijklmnopqrstuvwxyz';
    const randomIndex = Math.floor(Math.random() * lowerLetters.length);
    return lowerLetters[randomIndex];
}


// getting upper case letter
function getUpperLetter() {
    const upperLetters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const randomIndex = Math.floor(Math.random() * upperLetters.length);
    return upperLetters[randomIndex];
}


// getting digits
function getDigits() {
    const digits = '0123456789';
    const randomIndex = Math.floor(Math.random() * digits.length);
    return digits[randomIndex];
}


// get symbols
let symbols='~`!@#$%^&*(){[}}?/-_+<>';
function getSymbols(){
    let length=symbols.length;
    let index=getRandom(0,length);
    return symbols[index];
}

// setting the indicator color
function setIndicator(color){
    indicator.style.backgroundColor = color;
}
// we need to calculate the strength and set the indicator based on that strength
// strength is based on what all fields are checked
function checkStrength(){
    let hasUpper=false;
    if(upperCheck.checked) hasUpper=true;
    let hasLower=false;
    if(lowerCheck.checked) hasLower=true;
    let hasDigits=false;
    if(numberCheck.checked) hasDigits=true;
    let hasSymbols=false;
    if(symbolCheck.checked) hasSymbols=true;
    
    if(hasUpper==true && hasLower==true && (hasSymbols||hasDigits) && parseInt(passwordLength.textContent)>=8){
        setIndicator("#117554");
        strength.textContent="Strong password !";
    }
    else if((hasUpper||hasLower) && (hasDigits||hasSymbols) && parseInt(passwordLength.textContent)>=6){
        setIndicator("#624E88");
        strength.textContent="Moderate password !";
    }
    else{
        setIndicator("#C7253E");
        strength.textContent="Weak password !";
    }
}

// copy button
async function copyContent(){
   try{
    await navigator.clipboard.writeText(passwordDisplay.value); // returns an error if copy operation fails
     copyMsg.textContent="Copied !";
}
   catch(e){
    copyMsg.textContent="Copy Failed !";
   }
   // these statements are executed even if you enter the catch block
   // the above code just sets the text as it should be and the below code will remove the message after desired time out
   copyMsg.classList.add("active");
   setTimeout(()=>{
    copyMsg.classList.remove("active");
   },1500);
}
copyBtn.addEventListener("click",()=>{

    if(passwordDisplay.value){ // agr display me koi value hai 
        copyContent();
    }
});



// checkboxes
// let allCheckboxes=document.querySelectorAll('input[type="checkbox"]');
allCheckBoxes.forEach((checkbox)=>{
    checkbox.addEventListener("change",handleChange); 
}
)
let checkedCount=0;
function handleChange(){ // kisee bhi checkbox me change hoga yeh function starting se count krne aa jayega
    checkedCount=0; 
    allCheckBoxes.forEach((checkbox)=>{
        if(checkbox.checked) checkedCount++;
    });
    // if(parseInt(passwordLength.textContent) < checkedCount){
    //     passwordLength.textContent = checkedCount;
    //   handleSlider();
    // }
}
generateButton.addEventListener("click",()=>{
    generatePassword();
})
function generatePassword(){
    // think of various conditions e.g. if no checkbox is checked
    // hence we need to add event listener to checkboxes and update checkedCount variable
    // see the funn after this funn
    // also if all 4 are chacked, min length of password=4, even if we set slider at 1 , we need the checked boxes count to dominate 
    
    handleChange(); 
    if(checkedCount<=0){ // no checkbox checked, return
        return;
    }

    if(parseInt(passwordLength.textContent)<checkedCount){
        passwordLength.textContent=checkedCount;
        slider.value=checkedCount;
    }
    // now finding the new password
    // remove old password
    passwordDisplay.value = "";
    // now check ke kya kya daalna hai password me 
    // pehle yeh zruri kaa daaldo baaki bachi hui length me jo daalna hai daal do
    let password="";
    let array=[];
    if(upperCheck.checked) array.push(getUpperLetter);
    if(lowerCheck.checked) array.push(getLowerLetter);
    if(symbolCheck.checked) array.push(getSymbols);
    if(numberCheck.checked) array.push(getDigits);
    // compulsory addition= all elements of the array once atleast
    for(let i=0;i<array.length;i++){
        
        let char=array[i]();
        console.log("value added"+char);
        password+=char;
    }
    console.log("compulsory addn done");
    let size=array.length;
    let remaining=parseInt(passwordLength.textContent)-password.length; 
    while(remaining>0){
        let randomNum=Math.floor(Math.random()*size);// 0 1 2 .. size
        password+=array[randomNum]();
        remaining--;
    }
    console.log("remaining addn done");
    password=shuffleString(password);
    console.log("shuffle addn done");
    passwordDisplay.value=password;
    console.log("display done ");
    checkStrength();
}
function shuffleString(password){
    let arr=password.split('');
    for(let i=arr.length-1;i>=0;i--){
        let ran=Math.floor(Math.random()*i); // i==2 , ran=0/1
        let temp=arr[ran];
        arr[ran]=arr[i];
        arr[i]=temp;
    }
    return arr.join('');
}