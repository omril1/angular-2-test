import { Injectable } from '@angular/core';
import { tokenNotExpired } from 'angular2-jwt';
import he from '../configuration/auth0lock.config';
//var Auth0Lock = require('auth0-lock'); //fucks up my Systemjs.config, using direct cdn link instead :(

declare var Auth0Lock: any;

@Injectable()
export class Auth {
    // Configure Auth0
    private lock = new Auth0Lock('ZKwCrnzZEOiwx7aFuEwXFgRadzBy04Xe', 'omril.eu.auth0.com', {
        allowedConnections: ['Username-Password-Authentication', 'facebook', 'google-oauth2'],
        languageDictionary: he
    });
    public profile = JSON.parse(localStorage.getItem('profile'));
    public id_token = localStorage.getItem('id_token');

    constructor() {
        // Add callback for lock `authenticated` event
        this.lock.on("authenticated", (authResult) => {
            this.lock.getProfile(authResult.idToken, (error, profile) => {
                if (error)
                    throw new Error(error);
                localStorage.setItem('id_token', authResult.idToken);
                localStorage.setItem('profile', JSON.stringify(profile));
                this.profile = profile;
                this.profile = authResult.idToken;
            });
        });
    }

    public login() {
        // Call the show method to display the widget.
        this.lock.show();
    }

    public authenticated() {
        // Check if there's an unexpired JWT
        // This searches for an item in localStorage with key == 'id_token'
        return tokenNotExpired();
    }

    public logout() {
        // Remove token from localStorage
        localStorage.removeItem('id_token');
        localStorage.removeItem('profile');
        this.profile = null;
        this.id_token = null;
    }
    public isAdmin() {
        //return this.profile && this.profile.roles.indexOf('admin') > -1;
        return true;
    }
}