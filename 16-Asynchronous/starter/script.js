'use strict';

const btn = document.querySelector('.btn-country');
const countriesContainer = document.querySelector('.countries');

const renderError = (msg) => {
    countriesContainer.insertAdjacentText('beforeend', msg)
    countriesContainer.style.opacity = 1
}

const renderCountry = (data, className = '') => {
    const html = `
    <article class="country ${className}">
    <img class="country__img" src="${Object.entries(data.flags)[0][1]}" />
    <div class="country__data">
    <h3 class="country__name">${data.name.common}</h3>
            <h4 class="country__region">${data.region}</h4>
            <p class="country__row"><span>👫</span>${(
                +data.population / 1000000
            ).toFixed(1)} M people</p>
            <p class="country__row"><span>🗣️</span>${
                Object.entries(data.languages)[0][1]
            }</p>
            <p class="country__row"><span>💰</span>${
                Object.entries(Object.entries(data.currencies)[0][1])[0][1]
            }</p>
            </div>
    </article>
    `;

    countriesContainer.insertAdjacentHTML('beforeend', html)
}


///////////////////////////////////////
// Our first request: XML requests
/*

const getCountryAndNeighbour = (country) => {
    
    // AJAX call country
    const request = new XMLHttpRequest()
    request.open('GET', `https://restcountries.com/v3.1/name/${country}`)
    request.send();
    
    
    request.addEventListener('load', (e) => {
        const [data] = JSON.parse(e.target.response)

        // Render country 1
        renderCountry(data)

        // Get neighbour country
        const neighbour = data.borders?.[0]
        
        if (!neighbour) return

        // AJAX call country 2
        const request2 = new XMLHttpRequest()
        request2.open('GET', `https://restcountries.com/v3.1/alpha/${neighbour}`)
        request2.send();

        request2.addEventListener('load', (e) => {
            const [data2] = JSON.parse(e.target.response)
            console.log(data2);

            renderCountry(data2, 'neighbour')
        })
    })
}

getCountryAndNeighbour('korea')

*/




////////////////////////////////////////////////////////////////////
// Fetch api requests

/*

const getCountryData = (country) => {
    // Country 1
    fetch(`https://restcountries.com/v3.1/name/${country}`)
    .then(response => {
        
        if (!response.ok){
            throw new Error(`Country not found (${response.status})`)
        }
        return response.json()
    })
    .then(data => {
        renderCountry(data[0])
        // const neighbour = data[0].borders?.[0]
        const neighbour = 'asdads'

        if (!neighbour) return;

        // Country 2
        return fetch(`https://restcountries.com/v3.1/alpha/${neighbour}`)
    })
    .then(response => response.json())
    .then(([data]) => renderCountry(data, 'neighbour'))
    .catch(err => {
        renderError(`Something went wrong. ${err.message}. Try Again!`)
    })
    .finally(() => {
        countriesContainer.style.opacity = 1;
    })
    
}

*/

const getJSON = (url, errorMsg = "Something went wrong") => {
    return fetch(url)
    .then(response => {
        
        if (!response.ok){
            throw new Error(`${errorMsg}. ${response.status}`)
        }
        return response.json()
    })
}

const getCountryData = (country) => {
    // Country 1
    getJSON(`https://restcountries.com/v3.1/name/${country}`, 'Country not found')
    .then(data => {
        renderCountry(data[0])
        const neighbour = data[0].borders?.[0]
        // const neighbour = 'asdads'

        if (!neighbour) throw new Error('No neighbour found')

        // Country 2
        return getJSON(`https://restcountries.com/v3.1/alpha/${neighbour}`, 'Country not found')
    })
    .then(([data]) => renderCountry(data, 'neighbour'))
    .catch(err => {
        renderError(`Something went wrong. ${err.message}. Try Again!`)
    })
    .finally(() => {
        countriesContainer.style.opacity = 1;
    })
    
}


// btn.addEventListener('click', () => {
//     getCountryData('usa')
// })


///////////////////////////////////////
// Coding Challenge #1

/* 
In this challenge you will build a function 'whereAmI' which renders a country ONLY based on GPS coordinates. For that, you will use a second API to geocode coordinates.

Here are your tasks:

PART 1
1. Create a function 'whereAmI' which takes as inputs a latitude value (lat) and a longitude value (lng) (these are GPS coordinates, examples are below).
2. Do 'reverse geocoding' of the provided coordinates. Reverse geocoding means to convert coordinates to a meaningful location, like a city and country name. Use this API to do reverse geocoding: https://geocode.xyz/api.
The AJAX call will be done to a URL with this format: https://geocode.xyz/52.508,13.381?geoit=json. Use the fetch API and promises to get the data. Do NOT use the getJSON function we created, that is cheating 😉
3. Once you have the data, take a look at it in the console to see all the attributes that you recieved about the provided location. Then, using this data, log a messsage like this to the console: 'You are in Berlin, Germany'
4. Chain a .catch method to the end of the promise chain and log errors to the console
5. This API allows you to make only 3 requests per second. If you reload fast, you will get this error with code 403. This is an error with the request. Remember, fetch() does NOT reject the promise in this case. So create an error to reject the promise yourself, with a meaningful error message.

PART 2
6. Now it's time to use the received data to render a country. So take the relevant attribute from the geocoding API result, and plug it into the countries API that we have been using.
7. Render the country and catch any errors, just like we have done in the last lecture (you can even copy this code, no need to type the same code)

TEST COORDINATES 1: 52.508, 13.381 (Latitude, Longitude)
TEST COORDINATES 2: 19.037, 72.873
TEST COORDINATES 2: -33.933, 18.474

GOOD LUCK 😀
*/

const whereAmI = (lat, lng) => {
    fetch(`https://geocode.xyz/${lat},${lng}?geoit=json`)
    .then(response => {
        if (!response.ok) throw new Error(`Geocoding has gone wrong. ${response.status}`)
        return response.json()
    })
    .then(data => {
        console.log(`You are in ${data.region}, ${data.country}`)
        return fetch(`https://restcountries.com/v3.1/name/${data.country}`)
    })
    .then((response) => { 
        if (!response.ok) throw new Error(`Country not found. ${response.status}`)
        return response.json()
    })
    .then(([data]) => renderCountry(data))
    .catch(err => console.log(err.message))
    .finally(() => countriesContainer.style.opacity = 1)
}

// whereAmI(52.508, 13.381)
// whereAmI(19.037, 72.873)
// whereAmI(-33.933, 18.474)

//////// Event Loop in Practice

/*

console.log('Test start');
setTimeout(() => console.log('0 second timer'), 0)
Promise.resolve('Resolved promise 1').then(res => console.log(res));
Promise.resolve('Resolved promise 2').then(res => {
    for (let i=0; i< 1000; i++)
    console.log(res)
});
console.log('Test end');

*/

///////// Building a promise

/*

const lotteryPromise = new Promise(function(resolve, reject) {
    console.log('Lottery draw in progress... ');
    setTimeout(() => {
        if (Math.random() >= 0.5) {
            resolve('You WIN :D')
        } else {
            reject(new Error('You LOSE :('))
        }
    }, 2000)
})

lotteryPromise
.then((res => console.log(res)))
.catch(err => console.log(err))


*/ 
// Promisifying setTimeout
const wait = (seconds) => {
    return new Promise((resolve) => {
        setTimeout(resolve, seconds * 1000)
    })
}

/*
wait(1).then(() => {
    console.log('1 second passed');
    return wait(2);
})
.then(() => {
    console.log('2 seconds passed');
    return wait(3);
})
.then(() => {
    console.log('3 seconds passed');
    return wait(4);
})
.then(() => {
    console.log('4 seconds passed');
})

Promise.resolve('abc').then(x => console.log(x));
Promise.reject(new Error('def')).catch(y => console.log(y));

*/


// Promisifying geolocation
const getPosition = () => {
    return new Promise((resolve, reject) => {
        // navigator.geolocation.getCurrentPosition(
        //     position => resolve(position),
        //     err => reject(new Error(err))
        // ) 
        navigator.geolocation.getCurrentPosition(resolve, reject)
    })
}

// getPosition().then(pos => console.log(pos));

const whereAmI2 = () => {
    getPosition().then(pos => {
        const {latitude: lat, longitude: lng} = pos.coords
        return fetch(`https://geocode.xyz/${lat},${lng}?geoit=json`)
    })
    .then(response => {
        if (!response.ok) throw new Error(`Geocoding has gone wrong. ${response.status}`)
        return response.json()
    })
    .then(data => {
        console.log(`You are in ${data.region}, ${data.country}`)
        return fetch(`https://restcountries.com/v3.1/name/${data.country}`)
    })
    .then((response) => { 
        if (!response.ok) throw new Error(`Country not found. ${response.status}`)
        return response.json()
    })
    .then(([data]) => renderCountry(data))
    .catch(err => console.log(err.message))
    .finally(() => countriesContainer.style.opacity = 1)
};

// btn.addEventListener("click", whereAmI2 )


///////////////////////////////////////
// Coding Challenge #2

/* 
Build the image loading functionality that I just showed you on the screen.

Tasks are not super-descriptive this time, so that you can figure out some stuff on your own. Pretend you're working on your own 😉

PART 1
1. Create a function 'createImage' which receives imgPath as an input. This function returns a promise which creates a new image (use document.createElement('img')) and sets the .src attribute to the provided image path. When the image is done loading, append it to the DOM element with the 'images' class, and resolve the promise. The fulfilled value should be the image element itself. In case there is an error loading the image ('error' event), reject the promise.

If this part is too tricky for you, just watch the first part of the solution.

PART 2
2. Consume the promise using .then and also add an error handler;
3. After the image has loaded, pause execution for 2 seconds using the wait function we created earlier;
4. After the 2 seconds have passed, hide the current image (set display to 'none'), and load a second image (HINT: Use the image element returned by the createImage promise to hide the current image. You will need a global variable for that 😉);
5. After the second image has loaded, pause execution for 2 seconds again;
6. After the 2 seconds have passed, hide the current image.

TEST DATA: Images in the img folder. Test the error handler by passing a wrong image path. Set the network speed to 'Fast 3G' in the dev tools Network tab, otherwise images load too fast.

GOOD LUCK 😀
*/

const createImage = (imgPath) => {
    return new Promise((resolve, reject) => {
        const image = document.createElement('img')
        image.src = imgPath
        
        image.addEventListener('load', () => {
            document.querySelector('.images').append(image)
            resolve(image)
    
        })
        image.addEventListener('error', () => {
            reject(new Error('Error loading image'))
        })
    })
};

/*
let currImg;
createImage('img/img-1.jpg')
.then(image => {
    currImg = image;
    console.log(image);
    return wait(2)
})
.then(() => {
    currImg.style.display = "none"
    return createImage('img/img-2.jpg')
})
.then(image => {
    currImg = image;
    console.log(image);
    return wait(2)
})
.then(() => {
    currImg.style.display = "none"
})
.catch(err => console.log(err))
*/

/////////// Async / Await

const whereAmI3 = async () => {
    try {
        // Geolocation
        const pos = await getPosition()
        const {latitude: lat, longitude: lng} = pos.coords

        // Reverse geocoding
        const resGeo = await fetch(`https://geocode.xyz/${lat},${lng}?geoit=json`)
        const dataGeo = await resGeo.json()

        // Country data
        const res = await fetch(`https://restcountries.com/v3.1/name/${dataGeo.country}`)
        if (!res.ok) throw new Error('Problem getting country')
        const [data] = await res.json()

        // Render country
        renderCountry(data)
        countriesContainer.style.opacity = 1;

        return `You are in ${dataGeo.city}, ${dataGeo.country}`
    }
    catch(err) {
        renderError(`${err.message}`)
        
        // Reject promise returned from async funcion
        throw err;
    }
};

/*
console.log(`1: Will get location`);
// const city = whereAmI3()
// console.log(city);
whereAmI3()
.then(location => console.log(`2: ${location}`))
.catch(err => console.log(`2: ${err.message}`))
.finally(() => {console.log(`3: Finished getting location`);})
*/

// console.log('1st')


////////// Error handling async / await 
/*
try {
    let y = 1;
    const x = 2;
    x = 3;
} catch (err) {
    alert(err.message)
}
*/

/*
(async function() {
    try {
        const location = await whereAmI3()
        console.log(location);
    }
    catch(err) {
        console.log(err.message)
    }
})();
*/

////////// Promises in parallel
const get3Countries = async function (c1, c2, c3) {
    try {
        /*
        const [data1] = await getJSON(`https://restcountries.com/v3.1/name/${c1}`)
        const [data2] = await getJSON(`https://restcountries.com/v3.1/name/${c2}`)
        const [data3] = await getJSON(`https://restcountries.com/v3.1/name/${c3}`)
        */
       
        // console.log([data1.capital, data2.capital, data3.capital])

        const data = await Promise.all([
            getJSON(`https://restcountries.com/v3.1/name/${c1}`),
            getJSON(`https://restcountries.com/v3.1/name/${c2}`),
            getJSON(`https://restcountries.com/v3.1/name/${c3}`) 
        ])

        console.log(data.map(d => d[0].capital));

    }
    catch(err){
        console.log(err.message);
    }
};

// get3Countries('portugal', 'canada', 'tanzania')



////////// Other Promise combinators

// Promise.race
/*
const promiseRace = async function (c1, c2, c3) {
    try {
        
        // const [data1] = await getJSON(`https://restcountries.com/v3.1/name/${c1}`)
        // const [data2] = await getJSON(`https://restcountries.com/v3.1/name/${c2}`)
        // const [data3] = await getJSON(`https://restcountries.com/v3.1/name/${c3}`)
        
       
        // console.log([data1.capital, data2.capital, data3.capital])

        const data = await Promise.race([
            getJSON(`https://restcountries.com/v3.1/name/egypt`),
            getJSON(`https://restcountries.com/v3.1/name/italy`),
            getJSON(`https://restcountries.com/v3.1/name/mexico`) 
        ])

        console.log(data[0])

    }
    catch(err){
        console.log(err.message);
    }
};

promiseRace()

const timeout = function(sec) {
    return new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Request took too long')), sec * 1000)
    })
}

Promise.race([
    getJSON(`https://restcountries.com/v3.1/name/egypt`),
    getJSON(`https://restcountries.com/v3.1/name/italy`),
    timeout(0.01)
])
.then(data => console.log(data[0]))
.catch(err => console.log(err))

*/

// Promise.allSettled

/*
Promise.allSettled([
    Promise.resolve('Success'),
    Promise.reject('Rejected'),
    Promise.resolve('Success Again')
])
.then(data => console.log(data))
*/

// Promise.any()

/*
Promise.any([
    Promise.resolve('Success'),
    Promise.reject('Rejected'),
    Promise.resolve('Success Again')
])
.then(data => console.log(data))
*/


///////////////////////////////////////
// Coding Challenge #3

/* 
PART 1
Write an async function 'loadNPause' that recreates Coding Challenge #2, this time using async/await (only the part where the promise is consumed). Compare the two versions, think about the big differences, and see which one you like more.
Don't forget to test the error handler, and to set the network speed to 'Fast 3G' in the dev tools Network tab.

PART 2
1. Create an async function 'loadAll' that receives an array of image paths 'imgArr';
2. Use .map to loop over the array, to load all the images with the 'createImage' function (call the resulting array 'imgs')
3. Check out the 'imgs' array in the console! Is it like you expected?
4. Use a promise combinator function to actually get the images from the array 😉
5. Add the 'parallel' class to all the images (it has some CSS styles).

TEST DATA: ['img/img-1.jpg', 'img/img-2.jpg', 'img/img-3.jpg']. To test, turn off the 'loadNPause' function.

GOOD LUCK 😀
*/
const loadNPause = async () => {
    try {
        let currImage = await createImage('img/img-1.jpg');
        await wait(2);
        currImage.style.display = 'none'
        currImage = await createImage('img/img-2.jpg');
        await wait(2);
        currImage.style.display = 'none'
        currImage = await createImage('img/img-3.jpg');
    } catch (err) {
        console.log(err);
    }
}

// loadNPause()

const loadAll = async (imgArr) => {
    try {
        const imgs = imgArr.map(async img => await createImage(img))
        const promises = await Promise.all(imgs)  
        promises.forEach(promise => promise.classList.add('parallel'))
    }
    catch(err) {
        console.log(err);
    }
} 

// loadAll(['img/img-1.jpg', 'img/img-2.jpg', 'img/img-3.jpg'])