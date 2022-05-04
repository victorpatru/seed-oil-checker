// Listening for user click on our button to trigger the getFetch function
document.querySelector('button').addEventListener('click', getFetch)

function getFetch() {
    // Getting user's barcode and placing it in the variable barcode
    const barcode = document.getElementById('barcode').value

    // Fetch from the Open Food Facts API based on the user's inputted barcode
    fetch(`https://world.openfoodfacts.org/api/v0/product/${barcode}.json`)
    .then(res => res.json())
    .then(data => {

        if (data.status === 1) {
            // pass data.product into the ProductInfo class
            const product = new ProductInfo(data.product)
            product.displayItem()
            product.displayTable()
        } else {
            alert('Please input a valid barcode!')
            return
        }
    })
    .catch(err => console.log(`error ${err}`))
}

// Creating the product information class that we are going to call if the user's barcode is valid
// It does two things: displays the items in the DOM and create the table with the ingredients and the "Seed Oil Checker" side-by-side
class ProductInfo {
    constructor(productDetails) {
        this.name = productDetails.product_name
        this.ingredients = productDetails.ingredients
        this.image = productDetails.image_url
    }

    displayItem() {
        // Display product image and name in the DOM
        document.getElementById('product-name').innerText = this.name
        document.getElementById('product-img').src = this.image
    }

    displayTable() {
        const seedOilList = ['almond oil', 'argan oil', 'borage oil', 'castor oil', 'cherry pit oil', 'corn oil', 'cottonseed oil', 'linseed oil', 'grape seed oil', 'hemp oil', 'rapeseed oil', 'canola oil', 'safflower oil', 'sesame oil', 'sunflower oil', 'palm oil']        
        const tableRef = document.getElementById('ingredient-table')

        if (tableRef.rows.length > 1) {
            tableRef.innerHTML = ''
        }

        for (const key in this.ingredients) {
            // Creating the table reference variable so we can start dynamically generate the table

            // Add product ingredients column
                // Making sure new ingredients are appended at the bottom of our table (-1 is shorthand for the end of a table)
                let newIngredientRow = tableRef.insertRow(-1)

                // Adding new ingredients within that cell (0 means that it will be placed in the first column of our dynamically generated table)
                let newIngredientCell = newIngredientRow.insertCell(0)

                // Creating the text for our table
                let newIngredientText = document.createTextNode(this.ingredients[key].text)

                // Appending the dynamically generated text to our current table
                newIngredientCell.appendChild(newIngredientText)

                if (seedOilList.includes(this.ingredients[key].text)) {
                    newIngredientCell.classList.add('contains-seed-oil')
                } else if (this.ingredients[key].text === 'sugar' || this.ingredients[key].text.includes('soya')) {
                    newIngredientCell.classList.add('contains-sugar')
                }
        }

    }
}