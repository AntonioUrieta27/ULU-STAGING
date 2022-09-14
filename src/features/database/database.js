import { db, storage } from '../../services/firebase';
import clientAxios from '../../config/axios';
//No se tienen en cuenta el posible error por no encontrar la tabla.

const master = 0;
const client = 1;
const user= 2;

//Los request, devuelven objetos los cuales solo se iteran con un for in.

export const database = {
    //#region QUERIES
    getUsers: async () => {
        const users =  await db.ref('users').get();
        return users.val();
        //return (users.exists()) ? users.val() : null;
    },
    getUser: async (uid) => {
        const user = await db.ref('users').child(uid).get();
        return user.val();
        //return (user.exists()) ? user.val() : null;
    },
    filterByUserRol: async (rol) => {
        const users = (await db.ref('users').get()).val();
        
        const requested_users = [];
        for(let user in users){
            let user_data = (await db.ref('users').child(user).get()).val();
            if(user_data.rol == rol){
                requested_users.push(user_data);
            }
        }
        
        return requested_users;
    },
    getCompanies: async () => {
        const companies = await db.ref('companies').get();
        return companies.val();
    },
    getCompany: async (company_id) => {
        const companies = await db.ref('companies').child(company_id).get();
        return companies.val();
    },
    filterUsersByCompany: async (company_id) => {//no funciona
        
    },
    getStories: async () => {
        return (await db.ref('stories').get()).val();
        //return (stories.exists()) ? stories.val() : null;
    },
    getUserStories: async (uid) => {
        const stories = await this.getStories();

        const user_stories = [];

        for(let story in stories){
            const story_data = this.getStory(story);//added
            if(story_data.creator_id == uid) user_stories.push(story_data);
        }

        return user_stories;
    },
    getStory: async (story_id) => {
        const story = await db.ref('stories').child(story_id).get()
        return story.val();
        //return (story.exists()) ? story.val() : null;
        //return stories.filter(story => story.id == story_id);
    },
    //#endregion
    //#region UPDATES
    addCompany: async (company) => {
        const company_uid = await db.ref('companies').push().key;
        
        company.uid = company_uid;
        let updates = {};
        updates[`/${company_uid}`] = company;

        await db.ref('companies').update(updates);

        const new_company = (await db.ref('companies').child(company_uid).get()).val();

        return company;//[company_uid, new_company];
    },
    addUser: async (user) => {
        const user_uid = db.ref('users').push().key;

        let updates = {};
        updates[`/${user_uid}`] = user;

        await db.ref('users').update(updates);

        return user;
    },
    updateUser: async (user) => {
        let updates = {};
        if(user.password) {
            user.password = null;
            user.hasToChangePassword = false;
        }
        updates[`/${user.uid}`] = user;
        db.ref('users').update(updates);
    },
    updateUserFirstEmail: (user) => {
        let updates = {};

        user.hasToChangePassword = false;
        
        updates[`/${user.uid}`] = user;
        db.ref('users').update(updates);
    },
    updateUserUID: async (newUID, oldUID) => {
        const user = (await db.ref('users').child(oldUID).get()).val();
        let updates = {};
        updates[`/${oldUID}`] = null;
        db.ref('users').update(updates);

        user.password = null;
        user.pending = null;
        user.uid = newUID;
        updates[`/${newUID}`] = user;
        db.ref('users').update(updates);
        
        return (await db.ref('users').child(newUID).get()).val();
    },
    updateUserNot: async (uid, not) => {
        const user = (await db.ref('users').child(uid).get()).val();
        let updates = {};
        updates[`/${uid}`] = null;
        if (user.notifications && user.notifications.length > 0) {
            user.notifications = [...user.notifications, not];
        }else{
            user.notifications = [not];
        }
        updates[`/${uid}`] = user;
        db.ref('users').update(updates);
        const response= (await db.ref('users').child(uid).get()).val();
        console.log(response)
    },
    clearUserNot: async (uid) => {
        const user = (await db.ref('users').child(uid).get()).val();
        let updates = {};
        user.notifications = [];
        updates[`/${uid}`] = user;
        db.ref('users').update(updates);
        const response= (await db.ref('users').child(uid).get()).val();
        console.log(response)
    },
    addStory: (story) => {
        const story_uid = db.ref('stories').push().key;

        let updates = {};
        
        updates[`/${story_uid}`] = {uid: story_uid, ...story};

        db.ref('stories').update(updates);

        return updates[`/${story_uid}`];
    },
    updateStory: (story) => {
        let updates = {};
        updates[`/${story.uid}`] = story;
        db.ref('stories').update(updates);
    },
    deleteStory: async (story_uid) => {
        const story = (await db.ref('stories').child(story_uid).get()).val();

        if(!story) return null;

        await db.ref('stories').child(story_uid).remove();
    },
    deleteUser: async (user_uid) => {
        const user = (await db.ref('users').child(user_uid).get()).val();
        
        if(!user) return null;

        await db.ref('users').child(user_uid).remove();
        
        return user;
    },
    deleteCompany: async (company_id) => {
        const company_users = (await db.ref('users').get()).val();
        console.log(company_users)
        for(let user in company_users){
            const user_data = (await db.ref('users').child(user).get()).val();
            if(user_data.client_id == company_id){
                deleteUserCall(user);
            }
        }

        return await db.ref('companies').child(company_id).remove();        
    }
    //#endregion
};

export const emailIsAlreadyInUse = async (email) => {
    const users =  (await db.ref('users').get()).val();
    
    let in_use = false;

    if(!users) return in_use;

    for(let user in users) {
        const user_data = (await db.ref('users').child(user).get()).val();
        if(user_data.email == email) {
            in_use = true;
        }
    }

    return in_use;
}

async function deleteUserCall(user_uid){
    const response = await database.deleteUser(user_uid);
    if(!response.hasOwnProperty('pending')){
        await clientAxios.post('/firebase/delete', {user_uid: user_uid})
    }    
}