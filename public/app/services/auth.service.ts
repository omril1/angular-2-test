import { Injectable } from '@angular/core';
import { tokenNotExpired } from 'angular2-jwt';
import he from '../configuration/auth0lock.config';

// Avoid name not found warnings
declare var Auth0Lock: any;

@Injectable()
export class Auth {
    // Configure Auth0
    private lock = new Auth0Lock('ZKwCrnzZEOiwx7aFuEwXFgRadzBy04Xe', 'omril.eu.auth0.com', {
        allowedConnections: ['Username-Password-Authentication', 'facebook', 'google-oauth2'],
        languageDictionary: he
    });
    public profile = JSON.parse(localStorage.getItem('profile'));

    constructor() {
        // Add callback for lock `authenticated` event
        this.lock.on("authenticated", (authResult) => {
            this.lock.getProfile(authResult.idToken, (error, profile) => {
                if (error)
                    throw new Error(error);
                localStorage.setItem('id_token', authResult.idToken);
                localStorage.setItem('profile', JSON.stringify(profile));
                this.profile = profile;
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
    }
    public isAdmin() {
        return this.profile && this.profile.roles.indexOf('admin') > -1;
    }
}