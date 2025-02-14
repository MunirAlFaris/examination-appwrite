import { IExam, IUserProfile } from "../../universal/model";
import { account, databases } from "./appwrite";

const dbId = '67aa40db000fc50a5cc1';

// Registration (remains correct)
export async function register(
  email: string,
  password: string,
  name: string,
) {
  try {
    const user = await account.create(
      'unique()', // Auto-generate user ID
      email,
      password,
      name
    );
    console.log('User created:', user);
    return user;
  } catch (error) {
    console.error('Error:', error);
    return null;
  }
}

// Login (updated method name)
export async function login(email: string, password: string) {
  try {
    const session = await account.createEmailPasswordSession(email, password); // ✅ Correct method
    console.log('Logged in:', session);
    return session;
  } catch (error) {
    console.error('Login failed:', error);
    return null;
  }
}

// Logout (correct)
export async function logout() {
  try {
    await account.deleteSession('current');
    console.log('Logged out successfully');
    return true;
  } catch (error) {
    console.error('Logout failed:', error);
    return false;
  }
}

// Check if user is logged in
export async function getCurrentUser() {
  try {
    return await account.get();
  } catch (error) {
    console.log(error)
    return null;
  }
}

export const createDocument = async (
  collectionId: string,
  data: IExam | IUserProfile,
  onSucess: (res: string) => void,
  onError: () => void
) => {
  try {
    const response = await databases.createDocument(
      dbId,
      collectionId,
      'unique()',
      data,
    );
    console.log('Created:', response);
    onSucess(response.$id)
  } catch (error) {
    console.error('Error creating document:', error);
    onError()
  }
};

export const deleteDocument = async (collectionId: string, documentId: string, onSucess: () => void) => {
  try {
    await databases.deleteDocument(
      dbId,
      collectionId,
      documentId
    );
    console.log('Document deleted');
    onSucess();
  } catch (error) {
    console.error('Error deleting document:', error);
  }
};

export const updateDocument = async (
  collectionId: string,
  documentId: string,
  buies: string,
  prise: string,
  // onSucess: (data: IRecusiveExam) => void
) => {
  try {
    const response = await databases.updateDocument(
      dbId,
      collectionId,
      documentId,
      {
        buies,
        prise,
      }
    );
    console.log('Updated:', response);
    // onSucess(response)
  } catch (error) {
    console.error('Error updating document:', error);
  }
};

export const fetchDocuments = async (
  // onSucess: (data: IRecusiveExam[]) => void,
  collectionId: string,
  onError: () => void
) => {
  try {
    const response = await databases.listDocuments(
      dbId,
      collectionId,
    );
    console.log('Documents:', response.documents);
    // onSucess(response.documents);
  } catch (error) {
    console.error('Error fetching documents:', error);
    onError()
  }
};

export const getSingleDocument = async (
  collectionId: string,
  documentId: string,
) => {
  try {
    const document = await databases.getDocument(
      dbId,
      collectionId,
      documentId
    );
    console.log('Document:', document);
    return document
  } catch (error) {
    console.error('Error fetching document:', error);
    return null
  }
}