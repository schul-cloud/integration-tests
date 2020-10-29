#@sendConsentFormEmail
#Feature: Send emails to pupils that have not accepted the consent form yet
#	As an admin on Schul-Cloud
#	I want to be able to send and email containing an link to accept the consent form to all students that haven't accepted it
#
#	Background:
#
#		Given admin arrives on the Schul-Cloud homepage
#
#	Scenario Outline: Admin sends email to pupils
#
#		When admin logs in with email '<adminsUsername>' and password '<adminsPassword>'
#		And admin accepts data protection
#		When admin goes to administration
#		And admin goes to students administration
#		When admin clicks the send links to pupil email address button
#		Then the email is sent to all students that have not accepted
#
#		Examples:
#			| adminsUsername        | adminsPassword |
#	    	| admin@schul-cloud.org | Schulcloud1!   |
