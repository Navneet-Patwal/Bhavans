import {Account, Avatars, Client, Databases, OAuthProvider } from "react-native-appwrite";
import { openAuthSessionAsync } from "expo-web-browser";
import * as Linking from "expo-linking";
export const config = {
    platform : 'com.bhavans.n',
    endpoint: process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT,
    projectId: process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID,
    databaseId: process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID,
    galleriesCollectionId: process.env.EXPO_PUBLIC_APPWRITE_GALLERIES_COLLECTION_ID,
    reviewsCollectionId: process.env.EXPO_PUBLIC_APPWRITE_REVIEWS_COLLECTION_ID,
    agentsCollectionId: process.env.EXPO_PUBLIC_APPWRITE_AGENTS_COLLECTION_ID,
    propertiesCollectionId: process.env.EXPO_PUBLIC_APPWRITE_PROPERTIES_COLLECTION_ID,
};

export const client = new Client();

client.setEndpoint(config.endpoint!)
.setProject(config.projectId!)
.setPlatform(config.platform);

export const avatar = new Avatars(client);

export const account = new Account(client);

export const databases =  new Databases(client);

export const checkActiveSession = async () => {
    try {
      const session = await account.getSession('current');  // Get the current active session
      console.log('Active session found:', session);
      return true;
      // Handle the case where the user is already logged in (redirect or show profile)
    } catch (error) {
      // If there's no active session, proceed to login/signup
      console.log('No active session, proceeding to login/signup');
      return false;
    }
  };
  



export async function login() {
    try {
      const redirectUri = Linking.createURL("/");
      const response = await account.createOAuth2Token(
        OAuthProvider.Google,
        redirectUri
      );

      if (!response) throw new Error("Create OAuth2 token failed");
  
      const browserResult = await openAuthSessionAsync(
        response.toString(),
        redirectUri
      );
      if (browserResult.type !== "success")
        throw new Error("Create OAuth2 token failed");
  
      const url = new URL(browserResult.url);
      const secret = url.searchParams.get("secret")?.toString();
      const userId = url.searchParams.get("userId")?.toString();
      if (!secret || !userId) throw new Error("Create OAuth2 token failed");
  
      const session = await account.createSession(userId, secret);
      if (!session) throw new Error("Failed to create session");
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  }

export async function logout() {
    try {
        await account.deleteSession('current');
        return true;
    } catch (error) {
        console.error(error);
        return false;
    }
}

export async function getCurrentUser(){
    try { 
      const response = await account.get();
      if(response.$id){
        const userAvatar = avatar.getInitials(response.name);
        return {
            ...response,
            avatar: userAvatar.toString()
        };
      }

    } catch (error) {
        console.error(error);
        return null;
    }
}
