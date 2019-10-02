'use strict';
const { CLIENT } = require("../shared-objects/servers");
let administration = require('../page-objects/administration');
const firstLogin = require('../shared_steps/firstLogin.js');
const pupilLogin = require('../page-objects/pupilLogin.js');
const teams = require('../page-objects/createTeam');
const { expect } = require('chai');
let newsName1 = "News for Team A";
let newsName2 = "News for Team B";
let length;
const Login = require('../shared-objects/loginData');
const team = require('../shared-objects/teamsData');
let index=[];
const Admin = require('../shared-objects/administrationData');

// User Data:
let firstnameONE = "Team A";
let firstnameTWO = "Team B";
let lastnameONE = "A";
let lastnameTWO = "B";
let fullnameONE = firstnameONE + " " + lastnameONE;
let fullnameTWO = firstnameTWO + " " + lastnameTWO;
let emailONE= "ateam@schul-cloud.org";
let emailTWO = "bteam@schul-cloud.org";
let team_name_one = "A-team";
let team_name_two = "B-team";
let oldPassword;
let oldPassword1;
let oldPassword2;

module.exports = {
  gotoNews: async function() {
    let url = `${CLIENT.URL}/news/`;
    await helpers.loadPage(url, 100);
  
  },
  createNewNews: async function() {
    let url = `${CLIENT.URL}/news/new`;
    await helpers.loadPage(url, 100);
  },
  gotoTeams: async function() {
    let url = `${CLIENT.URL}/teams/`;
    await helpers.loadPage(url, 100);
},
  createNews: async function(name) {
    let nameField = await driver.$('[data-testid="news_title"]');
    let bodytext = 'Here are some announcements for my pupuils';
    await nameField.waitForExist(10000);
    await nameField.setValue(name);
    await driver.pause(2000);
    await driver.switchToFrame(0);
    await driver.pause(300);
    let body = await driver.$('body');
    await body.setValue(bodytext);
    await driver.switchToParentFrame();
    await driver.pause(300);
    let add = await driver.$(Login.elem.submitNewsBtn);
    await add.click();
    await driver.pause(500);
  },
  performCreateNews: async function(newsName) {
    //await firstLogin.firstLoginTeacher();
    await this.gotoNews();
    await this.createNewNews();
    await this.createNews(newsName);
  },
  executeScript: async function() {
    await driver.execute(`document.querySelector('input[data-testid="news_date_to_be_displayed"]').value = "13.08.2020"`);
  },
  performCreateNewsLater: async function(name) {
   // await firstLogin.firstLoginTeacher();
    await this.gotoNews();
    await driver.pause(1000);
    await this.createNewNews();
    await driver.pause(1000);
    let nameField = await driver.$('[data-testid="news_title"]');
    let bodytext = 'Here are some announcements for my pupuils';
    await nameField.waitForExist(1000);
    await nameField.setValue(name);
    await driver.pause(2000);
    await this.executeScript();
    await driver.switchToFrame(0);
    await driver.pause(300);
    let body = await driver.$('body');
    await body.setValue(bodytext);
    await driver.switchToParentFrame();
    await driver.pause(300);
    let add = await driver.$(Login.elem.submitNewsBtn);
    await add.click();
  },
  loginAsPupil: async function() {
    let name= "paula.meyer@schul-cloud.org";
    let pass= "Schulcloud1!";
    await firstLogin.logout();
    await firstLogin.pupilLogin(name,pass);
    await firstLogin.firstLoginPupilFullAge(name, pass);
  },
  verifyWhetherVisible: async function() {
    const elements = await driver.$$(
      '#main-content > div.route-news > div > section > div > div > div > article > div.sc-card-header > span > div > span'
    );
    const namePromises = elements.map(async element => await element.getText());
    const newsNames = await Promise.all(namePromises);
    return newsNames;
  },
  shouldBeVisible: async function(name) {

    let newsNames = await this.verifyWhetherVisible();
    await expect(newsNames).to.include(name);
  },
  shouldNotBeVisible: async function(name) {
    let newsNames = await this.verifyWhetherVisible();
    await expect(newsNames).to.not.include(name);
  },
  createTeam: async function(firstname, lastname, email, team_name, fullname) {
    await administration.performCreateNewPupil(firstname, lastname, email);
    await this.submitConsent(email);
    await teams.createATeamSTEPS(team_name);
    await teams.addMembersToTheTeamSTEPS();
    await teams.addTeamMemberSTEPS(fullname);
  },

  createTeamNewsForTeam: async function(team_name) {
    let teamElementsArray = await driver.$$('#main-content > section > section > div > div > div');
    for (var i=0; i<=teamElementsArray.length-1; i++) {
      let nameContainer = await driver.$('#main-content > section > section > div > div > div:nth-child('+(i+1)+') > article > div.sc-card-header > span > div > span');
      let name_of_the_team = await nameContainer.getText();
      await driver.pause(1000);
      if (name_of_the_team == team_name) {
        await index.push(i+1)
      }
    }
  },
  
    gotoTeamNews: async function() {
      let newsTab = await driver.$('[data-tab="js-news"] > span');
      await newsTab.click();
      let btn = await driver.$(team.submitBtn);
      await btn.click();
    },
    getTeamIndexByName: async function(teamname) {
      let container = await driver.$('div[data-testid="container"]');
      let titles = await container.$$('.title');
      for(var i=0; i<=titles.length; i++) {
        if(await titles[i].getText()==teamname) {
          return i+1;
        }
      }
    },
    chooseTeamByIndex: async function(teamname) {
      let index = await this.getTeamIndexByName(teamname);
      let container = await driver.$('div[data-testid="container"]');
      let team = await container.$('div:nth-child('+index+')');
      await team.click();
      await driver.pause(1000);

    },
    createTeamNews: async function(teamname) {
      let newsName = 'news for '+teamname+' and only'
      await teams.goToTeams();
      await this.chooseTeamByIndex(teamname);
      await this.gotoTeamNews();
      await this.createNews(newsName);
    },
  createTeamNewsSTEPS: async function() {
    let newsTab = await driver.$(team.newsTab);
    await newsTab.click();
    let newsBtn = await driver.$(team.submitBtn);
    await newsBtn.click();
 
  },
  submitConsent: async function(e_mail) {
    let names = await driver.$$(Admin.namesContainer + ' > tr');
    length = names.length; 
    for (var i = 1; i<= length; i++) {
        let pupil = await driver.$(Admin.namesContainer + ' > tr:nth-child('+i+')');
        let emailPromise =  await driver.$(Admin.namesContainer + ' > tr:nth-child('+i+') > td:nth-child(3)');
        let email = await emailPromise.getText();
        if (email===e_mail){
            let boxConsent = await driver.$(Admin.namesContainer + ' > tr:nth-child('+i+') > td:nth-child(7) > a:nth-child(2) > i');
            await boxConsent.click();
            let submitBtn = await driver.$(Admin.consentSubmitBtn);
            let passwordField = await driver.$('#passwd');
            let password_old = await passwordField.getValue();
            oldPassword = password_old;
            await submitBtn.click();
            break;
        }
    }
  },
  canTeamMemberSeeTheNews: async function() {
    let email = emailTWO;
    let name = email; 
    let password = "Schulcloud1!";
    await firstLogin.logout();
    await firstLogin.pupilLogin(email, oldPassword2);
    await firstLogin.firstLoginPupilFullAge(name, password);
    await this.gotoNews();
    await this.shouldBeVisible(newsName2)
  },
  canNonTeamMemberSeeTheNews: async function(email, password, teamname) {
    let teamNews = 'news for '+teamname+' and only';
    let new_password = 'Schulcloud1!';
    await firstLogin.logout();
    await pupilLogin.performLogin(email,password)
    await firstLogin.firstLoginPupilFullAge(email, new_password);
    await this.gotoNews();
    await this.shouldNotBeVisible(newsName1)
  },
}



