// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

contract Assessment {
    address payable public owner;
    uint256 public balance;
    string public language; // Variable to store the current language

    event Deposit(uint256 amount);
    event Withdraw(uint256 amount);
    event LanguageChanged(string newLanguage); // Event to indicate language change
    event ReceiptGenerated(
        string userName,
        uint256 age,
        string accountType,
        uint256 cardNumber,
        uint256 monthlyTransaction
    ); // Event for digital receipt

    constructor(uint initBalance) payable {
        owner = payable(msg.sender);
        balance = initBalance;
        language = "en"; // Default language is English
    }

    function getBalance() public view returns(uint256){
        return balance;
    }

    function deposit(uint256 _amount) public payable {
        uint _previousBalance = balance;

        // make sure this is the owner
        require(msg.sender == owner, "You are not the owner of this account");

        // perform transaction
        balance += _amount;

        // assert transaction completed successfully
        assert(balance == _previousBalance + _amount);

        // emit the event
        emit Deposit(_amount);
    }

    // custom error
    error InsufficientBalance(uint256 balance, uint256 withdrawAmount);

    function withdraw(uint256 _withdrawAmount) public {
        require(msg.sender == owner, "You are not the owner of this account");
        uint _previousBalance = balance;
        if (balance < _withdrawAmount) {
            revert InsufficientBalance({
                balance: balance,
                withdrawAmount: _withdrawAmount
            });
        }

        // withdraw the given amount
        balance -= _withdrawAmount;

        // assert the balance is correct
        assert(balance == (_previousBalance - _withdrawAmount));

        // emit the event
        emit Withdraw(_withdrawAmount);
    }

    // Function to change language
    function changeLanguage(string memory _newLanguage) public {
        require(bytes(_newLanguage).length > 0, "Language cannot be empty");
        language = _newLanguage;
        emit LanguageChanged(_newLanguage);
    }

    // Function to generate digital receipt
    function generateReceipt(
        string memory _userName,
        uint256 _age,
        string memory _accountType,
        uint256 _cardNumber,
        uint256 _monthlyTransaction
    ) public {
        require(msg.sender == owner, "You are not the owner of this account");
        emit ReceiptGenerated(_userName, _age, _accountType, _cardNumber, _monthlyTransaction);
    }
}
