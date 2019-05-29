@adminLogin
Feature: Logging in as an admin
  As an admin on Schul-Cloud
  I want to be able to login with an admin account

  Background:
    Given an admin arrives on the Schul-Cloud login homepage

  Scenario Outline: User inputs the username and password
    When an admin puts in <username> and <password> and click the login-button
    Then an admin should see my dashboard
    Then the admin-dashboard should look like it looked before for <username>

    Examples:
      |username|password|
      |admin@schul-cloud.org|Schulcloud1!|
      