// return fuction inside function  and return grid in ans 

const makeGrid = (size, length) =>{
    let array =[]
    try {
        for(i = 1; i < size; i++){
            let array2 =[]
            for(j = 1; j < length; j++){
                let value = Math.random()
                array2.push(Math.round(value))
            }
            array.push(array2)
        }
        array[0][0] =1
    return array
    } catch (error) {
        console.error(error)
    }
}
let grid = makeGrid(10, 5);
console.log(grid);
