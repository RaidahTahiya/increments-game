/*
Names: Suhani Pandit and Raidah Tahiya
Date Created: February 11, 2026
Description: This file contains the JavaScript code for the Pizza Clicker game. It controls
             the game functionality such as, clicking the pizza to earn coins, purchasing upgrades,
             updating the scoreboard, unlocking rewards, displaying reward messages, and handling the help menu.
*/

window.addEventListener("load", function () {

    let pizzaCount = 0;
    let pizzaPerClick = 1;
    let totalPizzaEver = 0;
    let coins = 0;

    let upgrades = {
        oven: { count: 0, cost: 100, clickBoost: 1 },
        chef: { count: 0, cost: 300, clickBoost: 5 },
        extracheese: { count: 0, cost: 150, clickBoost: 3 },
        specialsauce: { count: 0, cost: 200, autoclick: 800 }
    };

    let autoClickInterval = null;

    const pizzaImg = document.getElementById("pizza");
    const pizzaCountEl = document.getElementById("pizza-count"); //text element for number of pizzas
    const coinsEl = document.querySelector("#coins h2"); //text element for number of pizzas
    const clickValueEl = document.getElementById("click-value"); //text element for number of pizzas per click
    const totalPizzaEl = document.getElementById("total-pizza"); //text element for pizzas clicked in total
    const rewardMsgEl = document.getElementById("rewardmsg"); // element for reward message
    const helpPanel = document.getElementById("help-panel");
    const helpBtn = document.getElementById("help-btn");
    const helpClose = document.getElementById("help-close");

    pizzaImg.addEventListener("click", function () { //responsible for increasing the counts and calling updates and checks with pizza clicks
        pizzaCount += pizzaPerClick;
        coins += pizzaPerClick;
        totalPizzaEver += pizzaPerClick;
        updateDisplay();
        checkRewards();
    });

    /* Updates all displayed game values including pizzas, coins, click value, and upgrade costs/counts
    */
    function updateDisplay() {
        pizzaCountEl.innerText = pizzaCount;
        coinsEl.innerText = coins;
        clickValueEl.innerText = pizzaPerClick;
        totalPizzaEl.innerText = totalPizzaEver;

        for (let key in upgrades) {
            let upg = upgrades[key]; //Retrieving upgrade information for each item
            let costEl = document.getElementById("cost-" + key);
            let countEl = document.getElementById("count-" + key); //Accessing id from DOM
            if (costEl)  //Ensuring existance
                costEl.innerText = "Cost: " + upg.cost; //Increasing cost
            if (countEl)
                countEl.innerText = upg.count; //Updating count
        }
    }

    const upgradeButtons = document.querySelectorAll(".updatebox input"); //retriving all "buy" buttons from DOM

    for (let i = 0; i < upgradeButtons.length; i++) {
        let button = upgradeButtons[i];

        button.addEventListener("click", function () {

            const id = button.dataset.upgrade; //gets which upgrade button was clicked using its data attribute
            const upgrade = upgrades[id];

            if (!upgrade) {
                return;
            }

            if (coins >= upgrade.cost) {

                coins -= upgrade.cost;
                upgrade.count += 1;

                if (upgrade.clickBoost) {
                    pizzaPerClick += upgrade.clickBoost;
                }

                if (upgrade.autoclick !== undefined) {

                    if (autoClickInterval) {
                        clearInterval(autoClickInterval);
                    }

                    let intervalTime = Math.max(100, upgrade.autoclick - (upgrade.count - 1) * 100);

                    autoClickInterval = setInterval(function () { //

                        pizzaCount += pizzaPerClick;
                        coins += pizzaPerClick;
                        totalPizzaEver += pizzaPerClick;

                        updateDisplay();
                        checkRewards();

                    }, intervalTime);
                }

                upgrade.cost = Math.floor(upgrade.cost * 1.5);

                checkUpgradeReward();
                updateDisplay();

            } else {

                button.classList.add("cant-afford");

                setTimeout(function () {
                    button.classList.remove("cant-afford"); //Changes css style momentarily
                }, 500);

            }

        });

    }

    let rewards = {
        hat: { done: false, threshold: 50, id: "hat", msg: "First Slice! 🍕 50 pizzas!" },
        trophy1: { done: false, threshold: 100, id: "trophy1", msg: "Pizza Apprentice! 🏆 100 pizzas!" },
        trophy2: { done: false, threshold: 400, id: "trophy2", msg: "Bronze Baker! 🥉 400 pizzas!" },
        trophy3: { done: false, threshold: 1000, id: "trophy3", msg: "Silver Chef! 🥈 1000 pizzas!" },
        trophy4: { done: false, threshold: 2000, id: "trophy4", msg: "Pizza Master! 🥇 2000 pizzas!" },
        firstupgrade: { done: false, threshold: null, id: "firstupgrade", msg: "First Upgrade! ⭐ Keep it up!" }
    };

    /** 
     * checks if any rewards have been achieved
    */
    function checkRewards() {
        for (let key in rewards) {
            let reward_info = rewards[key]; //Retrieve information about that reward
            if (!reward_info.done && reward_info.threshold !== null && totalPizzaEver >= reward_info.threshold) { //not achieved, not the first reward, total pizzas meets requirements
                reward_info.done = true;    //reward acheived
                unlockReward(reward_info.id, reward_info.msg);
            }
        }
    }

    /** 
    * Seperate reward checker for firstUpgrade
    */
    function checkUpgradeReward() {
        let reward_info = rewards["firstupgrade"];
        if (!reward_info.done) {
            reward_info.done = true;  //reward unlocked
            unlockReward(reward_info.id, reward_info.msg);
        }
    }

    let msgTimeout = null;

    /** 
    * Triggers interactive display and message after achieving a reward
    * 
    * @param {string} imgId - id of reward image
    * @param {string} text - reward message to display
    */
    function unlockReward(imgId, text) {
        const img = document.getElementById(imgId);

        if (img) img.classList.add("unlocked"); //updates css of img (unblurs)
        rewardMsgEl.querySelector("h2").innerText = text;
        rewardMsgEl.style.display = "flex";

        if (msgTimeout) clearTimeout(msgTimeout);
        msgTimeout = setTimeout(() => {
            rewardMsgEl.style.display = "none";
        }, 3000);
    }

    helpBtn.addEventListener("click", function () { //Updates help panel display

        if (helpPanel.style.display === "flex") {
            helpPanel.style.display = "none";
        } else {
            helpPanel.style.display = "flex";
        }

    });

    helpClose.addEventListener("click", function () { //closes help panel because of the close button event
        helpPanel.style.display = "none";

    });
    updateDisplay();
});
