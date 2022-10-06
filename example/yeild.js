const sum = (a,b) =>{
    return a+b
}
function* selectGenrator(){
    yield sum(2,3)
}
const genrator = selectGenrator()
console.log(genrator.next())
try {
    console.log(genrator.next());
} catch (error) {
    console.log(error,'----------------------');
}