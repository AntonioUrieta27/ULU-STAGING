import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { db, auth, storage } from '../../services/firebase';
import { database } from '../database/database';

const initialStoryState = {
    title: 'My New Story',
    status: 0,
    creator_id: '',
    uid: '',
    has_audio: false,
    answers_zero: '',
    answers_first: '',
    answers_second: '',
    answers_third: '',
    answers_fourth: '',
    comments: [],
    notifications: [],
}

export const fetchUserStories = createAsyncThunk(
    'userstories/response',
    async (user_uid) => {
        const stories = (await db.ref('stories').get()).val();
        const arrayStory = Object.values(stories);
        
        const storyComplete = arrayStory.filter(story => story.creator_id == user_uid && story.status == "1" );
        const storyIncomplete = arrayStory.filter(story => story.creator_id == user_uid && story.status == "0" );

        const user_stories = {
            complete: storyComplete,
            incomplete: storyIncomplete
        };

        

        console.log(user_stories);
        return user_stories;
    }
)

export const deleteStory = createAsyncThunk(
    'deletestory/response',
    async (story_uid) => {
        try{
            await database.deleteStory(story_uid);
            let refToDelete = storage.ref(`/records`);
            const listOfFiles = await refToDelete.listAll();
            listOfFiles.items.forEach(async item => {
                if(item.name == story_uid){
                    await refToDelete.child(story_uid).delete();
                    return;      
                }
            })
            return story_uid;
        }catch(error){
            error.message = 'Cannot delete story. Try again later!';
            return error;
        }
    }
)

export const getRecord = createAsyncThunk(
    'getrecord/response',
    async (uid) => {
        const audio = await storage.ref(`records/${uid}.mp3`).getDownloadURL();
        return audio;
    }
)

export const getPublicStory = createAsyncThunk(
    'getstory/response',
    async (uid) => {
        
        const story = await database.getStory(uid);
        if(story && story.status == 1){
            const creator = await database.getUser(story.creator_id);
            const company = await database.getCompany(creator.client_id);
            if(story.has_audio) {
                const audio = await storage.ref(`records/${uid}.mp3`).getDownloadURL();
                story.audio = audio;
            }
            creator.company = company.name;
            story.creator = creator;
            return story;
        }

        let error = {response: false, msg: 'Sorry, this story is not public.'};
        throw error;
    }
)

export const userSlice = createSlice({
    name: 'user',
    initialState: {
        loading: false,
        complete_stories: [],
        incomplete_stories: [],
        user_error: null,
        story: initialStoryState
    },
    reducers: {
        createStory: (state, action) => {
            const story_created = database.addStory({
                creator_id: auth.currentUser.uid,
                title: action.payload,//o action
                status: 0, //0 -> incompleto || 1 -> completo
                has_audio: false,
                answers_zero: '',
                answers_first: '',
                answers_second: '',
                answers_third: '',
                answers_fourth: ''
            });
            state.incomplete_stories.push(story_created);
            state.story = story_created;
        },
        updateStory: (state, action) => {
            database.updateStory(state.story);//o action.payload

            if(state.story.status == 0){
                state.incomplete_stories.map(story => {
                    if(story.uid == state.story.uid) return story = state.story;
                });
            }else{//VER QUE TANTO SIRVE ESTO
                //si una historia incompleta pasa a completa
                const story_finished = state.incomplete_stories.filter(story => {
                    if(story.uid == state.story.uid && state.story.status == 1) return state.story;
                });
                if(story_finished.length > 0){
                    story_finished.map(story => state.complete_stories.push(story));
                    return;
                }
                //si una historia compelta pasa a incompleta
                const story_unfinished = state.complete_stories.filter(story => {
                    if(story.uid == state.story.uid && state.story.status == 0) return state.story;
                });
                if(story_unfinished.length > 0){
                    story_unfinished.map(story => state.incomplete_stories.push(story));
                    return;
                }
            }
        },
        updateStoryProperty: (state, action) => {
            if(!action.payload && !action.payload.key && !action.payload.value){
                state.user_error = 'Error on re-writing story propery';
                return;
            }
            state.story = {
                ...state.story,
                [action.payload.key]: action.payload.value
            };
            database.updateStory(state.story)
        },
        updateStoryComments: (state, action) => {
            if(!action.payload && !action.payload.comment){
                state.user_error = 'Error on writing comment story';
                return;
            }
            if(state.story?.comments?.length > 0){
              
                state.story = {
                    ...state.story,
                    comments: [...state.story.comments,action.payload.comment]
                };
            }else{
                state.story = {
                    ...state.story,
                    comments: [action.payload.comment]
                };
            }
            
            database.updateStory(state.story)
        },
        updateUserNotification: (state, action) => {
            if(!action.payload && !action.payload.uid){
                state.user_error = 'Error on writing comment story';
                return;
            }
        
            database.updateUserNot(action.payload.uid, action.payload.notification);
        },
        clearUserNotification: (state, action) => {
            if(!action.payload && !action.payload.uid){
                state.user_error = 'Error on writing comment story';
                return;
            }
        
            database.clearUserNot(action.payload.uid);
        },
        selectStory: (state, action) => {
            state.story = {
                ...initialStoryState,
                ...action.payload
            }
        },
        uploadRecord: (state, action) => {
            const storageRef = storage.ref(`records/${state.story.uid}`);
            state.story.has_audio = true;
            storageRef.put(action.payload);
            console.log(action.payload);
            database.updateStory(state.story);
            const storageRef2 = storage.ref(`records/${state.story.uid}.mp3`);
            storageRef2.put(action.payload);
            database.updateStory(state.story);

        },
        uploadDoc: (state, action) => {
            const storageRef = storage.ref(`docs/${state.story.uid}`);
            storageRef.put(action.payload);
        }
    },
    extraReducers: {
        [fetchUserStories.pending]: (state, action) => {
            state.loading = true;
        },
        [fetchUserStories.fulfilled]: (state, action) => {
            state.loading = false;
            state.user_error = null;
            if(JSON.stringify(state.complete_stories) !== JSON.stringify(action.payload.complete)){
                state.complete_stories = action.payload.complete;
            }
            if(JSON.stringify(state.incomplete_stories) !== JSON.stringify(action.payload.incomplete)){
                state.incomplete_stories = action.payload.incomplete;
            }
        },
        [fetchUserStories.rejected]: (state, action) => {
            state.loading = false;
            state.user_error = action.error.message;
        },

        [deleteStory.pending]: (state, action) => {
            state.loading = true;
        },
        [deleteStory.fulfilled]: (state, action) => {
            state.loading = false;
            state.user_error = null;
            state.complete_stories = state.complete_stories.filter(story => story.uid !== action.payload);
            state.incomplete_stories = state.incomplete_stories.filter(story => story.uid !== action.payload);
        },
        [deleteStory.rejected]: (state, action) => {
            state.loading = false;
            state.user_error = 'Cannot delete story. Try again later!';
        },

        [getRecord.pending]: (state, action) => {
            state.loading = true;
        },
        [getRecord.fulfilled]: (state, action) => {
            state.loading = false;
            state.user_error = null;
        },
        [getRecord.rejected]: (state, action) => {
            state.loading = false;
            state.user_error = 'Cannot find audio.';
        },

        [getPublicStory.pending]: (state, action) => {
            state.loading = true;
        },
        [getPublicStory.fulfilled]: (state, action) => {
            state.loading = false;
            state.user_error = null;
            state.story = action.payload;
        },
        [getPublicStory.rejected]: (state, action) => {
            state.loading = false;
            state.user_error = 'Ups! cannot find story.';
        }
    }
});

export const { selectStory, createStory, updateStory, updateStoryProperty, updateStoryComments,uploadRecord, uploadDoc, updateUserNotification, clearUserNotification } = userSlice.actions;

export default userSlice.reducer;