import { db } from "src/config/firebaseConfig";
import { DocumentReference } from "firebase-admin/firestore";
import { QuerySnapshot } from "firebase-admin/firestore";

export const addDocument = async (): Promise<void> => {
    // Create a reference to a document in the 'users' collection with ID 'user1'
    // If the document doesn't exist, it will be created
    const docRef: DocumentReference = db.collection("users").doc("user1");

    // Use the `set` method to add or overwrite data in the document
    // The data is passed as an object with fields and their values
    await docRef.set({
        name: "Test Conference",
        date: new Date(),
        capacity: 50,
        registrationCount: 0,
        status: "active",
        category: "conference",
        createdAt: new Date(),
        updatedAt: new Date(),
    });
    console.log("Document added");
};

const getDocument = async (): Promise<void> => {
    // Create a reference to a specific document in the 'users' collection
    const docRef: DocumentReference = db.collection("users").doc("user1");

    // Use the `get()` method to retrieve the document
    const doc = await docRef.get();

    // Check if the document exists
    if (doc.exists) {
        // `doc.data()` returns an object with all fields in the document
        console.log("Document data:", doc.data());
    } else {
        console.log("No such document!");
    }
};

const getCollection = async (): Promise<void> => {
    // Retrieve all documents from the 'users' collection
    // `get()` returns a QuerySnapshot containing all documents in the collection
    const snapshot: QuerySnapshot = await db.collection("users").get();

    // Iterate through each document in the collection
    snapshot.forEach((doc) => {
        // `doc.id` is the document's unique identifier
        // `doc.data()` returns an object with all fields in the document
        console.log(doc.id, "=>", doc.data());
    });
};

const updateDocument = async (): Promise<void> => {
    // Create a reference to a specific document in the 'users' collection
    const docRef: DocumentReference = db.collection("users").doc("user1");

    // Use the `update()` method to modify specific fields in the document
    // This will only change the specified fields, leaving others untouched
    await docRef.update({
        age: 31,
    });
    console.log("Document updated");
};

const deleteDocument = async (): Promise<void> => {
    // Create a reference to a specific document in the 'users' collection
    const docRef: DocumentReference = db.collection("users").doc("user1");

    // Use the `delete()` method to remove the document from Firestore
    await docRef.delete();
    console.log("Document deleted");
};