document.addEventListener('DOMContentLoaded', () => {

    const allSelects = document.querySelectorAll('#convertBox select'); //selecting all select elements
    const allInputs = document.querySelectorAll('#convertBox input') //selecting all input elements
    //selecting the individual select, input and image elements
    const firstSelect = document.getElementById('firstSelect');
    const secondSelect = document.getElementById('secondSelect');
    const firstImage = document.getElementById('firstImage');
    const secondImage = document.getElementById('secondImage');
    const firstInput = document.getElementById('firstInput');
    const secondInput = document.getElementById('secondInput');

    //Populating the select element => option elements using the contry code, currency code and names from the countryAndCurrencyList.js file
    //console.log((label = AED) + (innerText = UAE Dhiram) + (value = AE))
    for (let currCode in countryAndCurrencyList) {

        let firstSelectOption = document.createElement('option');

        firstSelectOption.value = countryAndCurrencyList[currCode].conCode;
        firstSelectOption.textContent = currCode;
        firstSelectOption.label = countryAndCurrencyList[currCode].currName;

        if (firstSelectOption.value === 'US') {
            firstSelectOption.selected = true;
            updateFlag(firstSelectOption.value, firstSelect);
        }

        let secondSelectOption = document.createElement('option');
        secondSelectOption.value = countryAndCurrencyList[currCode].conCode
        secondSelectOption.textContent = currCode;
        secondSelectOption.label = countryAndCurrencyList[currCode].currName;

        if (secondSelectOption.value === 'IN') {
            secondSelectOption.selected = true;
            updateFlag(secondSelectOption.value, secondSelect);
        }

        firstSelect.appendChild(firstSelectOption);
        secondSelect.appendChild(secondSelectOption);
    }

    updateExchangeVal('USD', 'INR', secondSelect);

    function updateFlag(countryCode, selectElement) {

        const imageUrl = `https://flagsapi.com/${countryCode}/flat/64.png`;

        if (selectElement.id === 'firstSelect') {
            firstImage.src = imageUrl;
        }
        if (selectElement.id === 'secondSelect') {
            secondImage.src = imageUrl;
        }
    }

    //calling an async function to fetch exchange rate for currencies for currency conversion


    async function updateExchangeVal(fromCurrencyCode, toCurrencyCode, selectElement) {

        try {

            const apiUrl = `https://api.freecurrencyapi.com/v1/latest?apikey=fca_live_LBLux415d6ssYtcgA0uWaU881j1ymXUp5VbxM0jo&currencies=${toCurrencyCode}&base_currency=${fromCurrencyCode}`;

            const response = await fetch(apiUrl);

            if (!response.ok) {
                throw new Error('Something Went Wrong');
            }

            const data = await response.json();
            const exchangeRate = data.data[toCurrencyCode];

            if (selectElement.id === 'firstSelect') {

                convertedAmount = (secondInput.value * exchangeRate).toFixed(6);
                firstInput.value = convertedAmount;
            }

            if (selectElement.id === 'secondSelect') {
                convertedAmount = (firstInput.value * exchangeRate).toFixed(6);
                console.log('😢 convertedAmount:', convertedAmount);
                secondInput.value = convertedAmount;
            }
        }

        catch (error) {
            console.error(error);
        }
    }


    //Adding event listner for select element change to fetch the corresponding flag 

    // firstSelectOption.value = countryAndCurrencyList[currCode].conCode;
    // firstSelectOption.innerText = countryAndCurrencyList[currCode].currName;
    // firstSelectOption.label = currCode;

    // console.log(`${currCode} + ${countryAndCurrencyList[currCode].currName} + ${countryAndCurrencyList[currCode].conCode}`);
    //console.log((label = AED) + (innerText = UAE Dhiram) + (value = AE))

    allSelects.forEach((sel) => {
        sel.addEventListener('change', () => {

            let countryCode = sel.value;
            let currencyName = sel.innerHTML;

            if (sel.id === 'firstSelect') {

                const toCurrencyCode = secondSelect.options[secondSelect.selectedIndex].text;
                const fromCurrencyCode = firstSelect.options[firstSelect.selectedIndex].text;

                updateFlag(countryCode, firstSelect);
                // updateExchangeVal(fromCurrencyCode, toCurrencyCode, toSelectElement, toInput)
                updateExchangeVal(fromCurrencyCode, toCurrencyCode, secondSelect);

            } else if (sel.id === 'secondSelect') {

                const toCurrencyCode = firstSelect.options[firstSelect.selectedIndex].text;
                const fromCurrencyCode = secondSelect.options[secondSelect.selectedIndex].text;

                updateFlag(countryCode, secondSelect);
                updateExchangeVal(fromCurrencyCode, toCurrencyCode, firstSelect);
            }
        })
    });

    allInputs.forEach(inputBox => {

        inputBox.addEventListener('input', () => {

            if (inputBox.id === 'firstInput') {

                const toCurrencyCode = secondSelect.options[secondSelect.selectedIndex].text;
                const fromCurrencyCode = firstSelect.options[firstSelect.selectedIndex].text;
                updateExchangeVal(fromCurrencyCode, toCurrencyCode, secondSelect);

            } else if (inputBox.id === 'secondInput') {

                const toCurrencyCode = firstSelect.options[firstSelect.selectedIndex].text;
                const fromCurrencyCode = secondSelect.options[secondSelect.selectedIndex].text;
                updateExchangeVal(fromCurrencyCode, toCurrencyCode, firstSelect);

            }

        })
    })

});