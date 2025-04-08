// ==UserScript==
// @name         AmericasFavoritePhotos Auto Voter
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Automate registration, voting, and logout on AmericasFavoritePhotos
// @match        https://americasfavoritephotos.com/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    const firstNames = ['James', 'Emma', 'Liam', 'Olivia', 'Noah', 'Ava', 'William', 'Sophia', 'Michael', 'Isabella', 'Alexander', 'Mia', 'Daniel', 'Charlotte', 'Henry', 'Amelia', 'Joseph', 'Harper', 'David', 'Evelyn', 'Samuel', 'Abigail', 'Benjamin', 'Emily', 'Lucas', 'Elizabeth', 'Mason', 'Sofia', 'Logan', 'Avery', 'Jackson', 'Ella', 'Sebastian', 'Scarlett', 'Gabriel', 'Chloe', 'Matthew', 'Lily', 'Ethan', 'Madison'];
    const lastNames = ['Smith', 'Johnson', 'Brown', 'Taylor', 'Wilson', 'Davis', 'Clark', 'Lewis', 'Walker', 'Hall', 'Anderson', 'Thomas', 'Moore', 'Martin', 'Jackson', 'Thompson', 'White', 'Harris', 'Allen', 'Young', 'King', 'Wright', 'Scott', 'Green', 'Adams', 'Baker', 'Nelson', 'Carter', 'Mitchell', 'Roberts', 'Turner', 'Phillips', 'Campbell', 'Parker', 'Evans', 'Edwards', 'Collins', 'Stewart', 'Morris', 'Rogers'];

    function getRandomItem(arr) {
        return arr[Math.floor(Math.random() * arr.length)];
    }

    function fillFormAndVote() {
        const randomFirst = getRandomItem(firstNames);
        const randomLast = getRandomItem(lastNames);
        const randomPassword = Math.floor(100000 + Math.random() * 900000).toString();

        // Handle registration page
        if (window.location.href.includes('/register')) {
            fetch('https://api.temp-mail.org/request/domains/format/json/')
                .then(response => response.json())
                .then(domains => {
                    const randomDomain = domains[Math.floor(Math.random() * domains.length)];
                    const tempEmail = `${randomFirst.toLowerCase()}${randomLast.toLowerCase()}${Math.floor(Math.random() * 100)}${randomDomain}`;

                    document.getElementById('first_name').value = randomFirst;
                    document.getElementById('last_name').value = randomLast;
                    document.getElementById('email').value = tempEmail;
                    document.getElementById('password').value = randomPassword;
                    document.getElementById('checkbox-agree').checked = true;

                    setTimeout(() => {
                        document.querySelector('form').submit(); // Submit registration
                    }, 1000);
                })
                .catch(error => {
                    console.error('API failed:', error);
                    const fallbackEmail = `${randomFirst.toLowerCase()}.${randomLast.toLowerCase()}@tempmail.org`;
                    document.getElementById('first_name').value = randomFirst;
                    document.getElementById('last_name').value = randomLast;
                    document.getElementById('email').value = fallbackEmail;
                    document.getElementById('password').value = randomPassword;
                    document.getElementById('checkbox-agree').checked = true;
                    setTimeout(() => {
                        document.querySelector('form').submit();
                    }, 1000);
                });
        }

        // Handle voting page
        else if (window.location.href.includes('/v/2mkqbk')) {
            const voteButton = document.querySelector('button[data-action="vote"]'); // Adjust selector based on actual vote button
            if (voteButton) {
                voteButton.click();
                setTimeout(() => {
                    window.location.href = 'https://americasfavoritephotos.com/logout'; // Redirect to logout
                }, 2000);
            }
        }

        // Handle logout page
        else if (window.location.href.includes('/logout')) {
            setTimeout(() => {
                window.location.href = 'https://americasfavoritephotos.com/register?redirect=%2Fv%2F2mkqbk%23cast'; // Loop back
            }, 1000);
        }
    }

    // Start the process if on the right page
    if (window.location.href.includes('americasfavoritephotos.com')) {
        fillFormAndVote();
    } else {
        window.location.href = 'https://americasfavoritephotos.com/register?redirect=%2Fv%2F2mkqbk%23cast';
    }
})();
