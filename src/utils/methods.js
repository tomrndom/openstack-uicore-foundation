/**
 * Copyright 2018 OpenStack Foundation
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 **/

import moment from 'moment-timezone';
import URI from "urijs";

export const findElementPos = (obj) => {
    var curtop = -70;
    if (obj.offsetParent) {
        do {
            curtop += obj.offsetTop;
        } while (obj = obj.offsetParent);
        return [curtop];
    }
}

export const epochToMoment = (atime) => {
    if(!atime) return atime;
    atime = atime * 1000;
    return moment(atime);
}

export const epochToMomentTimeZone = (atime, time_zone) => {
    if(!atime) return atime;
    atime = atime * 1000;
    return moment(atime).tz(time_zone);
}

export const formatEpoch = (atime, format = 'M/D/YYYY h:mm a') => {
    if(!atime) return atime;
    return epochToMoment(atime).format(format);
}

export const objectToQueryString = (obj) => {
    var str = "";
    for (var key in obj) {
        if (str != "") {
            str += "&";
        }
        str += key + "=" + encodeURIComponent(obj[key]);
    }

    return str;
}

export const getBackURL = () => {
    let url      = URI(window.location.href);
    let query    = url.search(true);
    let fragment = url.fragment();
    let backUrl  = query.hasOwnProperty('BackUrl') ? query['BackUrl'] : null;
    if(fragment != null && fragment != ''){
        backUrl += `#${fragment}`;
    }
    return backUrl;
}

/**
 *
 * Auth Utils
 */


export const getAccessToken = () => {
    return (typeof window !== 'undefined') ? window.accessToken : process.env.accessToken;
}

export const getIdToken = () => {
    return (typeof window !== 'undefined') ? window.idToken : process.env.idToken;
}

export const getOAuth2ClientId = () => {
    return (typeof window !== 'undefined') ? window.OAUTH2_CLIENT_ID : process.env.OAUTH2_CLIENT_ID;
}

export const getOAuth2IDPBaseUrl = () => {
    return (typeof window !== 'undefined') ? window.IDP_BASE_URL : process.env.IDP_BASE_URL;
}

export const getOAuth2Scopes = () => {
    return (typeof window !== 'undefined') ? window.SCOPES : process.env.SCOPES;
}

export const getAuthCallback = () => {
    return (typeof window !== 'undefined') ? `${window.location.origin}/auth/callback`: null;
}

export const getCurrentLocation = () => {
    let location = '';
    if(typeof window !== 'undefined') {
        location = window.location;
        // check if we are on iframe
        if (window.top)
            location = window.top.location;
    }
    return location;
}

export const getOrigin = () => {
    let origin = '';
    if(typeof window !== 'undefined') {
        origin = window.location.origin;
    }
    return origin;
}

export const getAllowedUserGroups = () => {
    return (typeof window !== 'undefined') ? (window.ALLOWED_USER_GROUPS || '') :  (process.env.ALLOWED_USER_GROUPS || '');
}

export const buildAPIBaseUrl = (relativeUrl) => {
    if(typeof window !== 'undefined'){
        return `${window.API_BASE_URL}${relativeUrl}`;
    }
    return `${process.env.API_BASE_URL}${relativeUrl}`;
}

export const storeAuthInfo = (accessToken, idToken, sessionState) => {
    if(typeof window !== 'undefined'){
        window.accessToken = accessToken;
        window.idToken = idToken;
        window.sessionState = sessionState;
        return;
    }
    process.env.accessToken = accessToken;
    process.env.idToken = idToken;
    process.env.sessionState = sessionState;
}

export const clearAuthInfo = () => {
    if(typeof window !== 'undefined'){
        window.accessToken = null;
        window.idToken = null;
        window.sessionState = null;
        return;
    }
    process.env.accessToken = null;
    process.env.idToken = null;
    process.env.sessionState = null;
}

export const putOnLocalStorage = (key, value) => {
    if(typeof window !== 'undefined') {
        window.localStorage.setItem(key, value);
    }
}