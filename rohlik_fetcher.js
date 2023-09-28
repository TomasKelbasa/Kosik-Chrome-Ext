/**
 * Tries to fetch product data from rohlik.cz web
 * 
 * @param { String } url rohlik.cz url (https://www.rohlik.cz)
 * @returns { Promise } Returns Promise with Object containing data (beforePrice , brand, inSale, name, ok, price, quantity).
 */
export default async function fetchFromURL(url){
    //console.log("Module succesfully imported!");

    let result = {};
    result.ok = false;

    if (!url || !url.includes("https://www.rohlik.cz")) return result;

    await fetch(url)
        .then((response) => response.text())
        .then((data) => {
            //converts only <main> of fetched HTML to HTML to save memory
            let dc = new DOMParser().parseFromString(
                data.split('<main>')[1],
                'text/html'
            );

            dc = dc.querySelector("#productDetail");
            if(!dc) return result;
            if (!dc.querySelector('h2') || !dc.querySelector('.detailQuantity')){
                return result;
            }

            dc.querySelector('[data-test="product-price"] span')?.remove();

            result.price = dc.querySelector('[data-test="product-price"]')?.textContent.trim();
            result.inSale = Boolean(dc.querySelector('[data-test="product-price"].actionPrice'));

            
            result.brand = dc.querySelector('h2 .iscxvd')?.textContent;
            dc.querySelector('h2 .iscxvd')?.remove();
            result.name = dc.querySelector('h2')?.textContent;

            result.quantity = dc.querySelector('.detailQuantity')?.textContent.trim();
            result.beforePrice = dc.querySelector('[data-test="product-in-sale-original"]')?.textContent;
            result.ok = true;
        })
        .catch((error) => {
            console.log(error); result.ok = false;});

    return result;
}