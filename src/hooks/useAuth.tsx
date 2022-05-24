import React, { useEffect, createContext, useContext, useState, ReactNode } from 'react';
import { makeRedirectUri, revokeAsync, startAsync } from 'expo-auth-session';
import { generateRandom } from 'expo-auth-session/build/PKCE';

import { api } from '../services/api';

const { CLIENT_ID } = process.env;

interface User {
  id: number;
  display_name: string;
  email: string;
  profile_image_url: string;
}

interface AuthContextData {
  user: User;
  isLoggingOut: boolean;
  isLoggingIn: boolean;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
}

interface AuthProviderData {
  children: ReactNode;
}

const AuthContext = createContext({} as AuthContextData);

const twitchEndpoints = {
  authorization: 'https://id.twitch.tv/oauth2/authorize',
  revocation: 'https://id.twitch.tv/oauth2/revoke'
};

function AuthProvider({ children }: AuthProviderData) {
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [user, setUser] = useState({} as User);
  const [userToken, setUserToken] = useState('');

  async function signIn() {
    try {
      setIsLoggingIn(true);
      
      const REDIRECT_URI = makeRedirectUri({ useProxy: true });
      const RESPONSE_TYPE = 'token';
      const SCOPE = encodeURI('openid user:read:email user:read:follows')
      const FORCE_VERIFY = true;
      const STATE = generateRandom(30);

      const authUrl = `${twitchEndpoints.authorization}?
      client_id=${CLIENT_ID}
      &redirect_uri=${REDIRECT_URI}
      &response_type=${RESPONSE_TYPE}
      &scope=${SCOPE}
      &force_verify=${FORCE_VERIFY}
      &state=${STATE}`;

      const { type } = await startAsync({ authUrl });

      if (type === 'success') {
        
      }
    
      // verify if startAsync response.type equals "success" and response.params.error differs from "access_denied"
      // if true, do the following:

        // verify if startAsync response.params.state differs from STATE
        // if true, do the following:
          // throw an error with message "Invalid state value"

        // add access_token to request's authorization header

        // call Twitch API's users route

        // set user state with response from Twitch API's route "/users"
        // set userToken state with response's access_token from startAsync
    } catch (error) {
      // throw an error
    } finally {
      // set isLoggingIn to false
    }
  }

  async function signOut() {
    try {
      // set isLoggingOut to true

      // call revokeAsync with access_token, client_id and twitchEndpoint revocation
    } catch (error) {
    } finally {
      // set user state to an empty User object
      // set userToken state to an empty string

      // remove "access_token" from request's authorization header

      // set isLoggingOut to false
    }
  }

  useEffect(() => {
    api.defaults.headers['Client-Id'] = CLIENT_ID;
  }, [])

  return (
    <AuthContext.Provider value={{ 
      user, 
      isLoggingOut, 
      isLoggingIn, 
      signIn, 
      signOut 
    }}>
      { children }
    </AuthContext.Provider>
  )
}

function useAuth() {
  const context = useContext(AuthContext);

  return context;
}

export { AuthProvider, useAuth };
