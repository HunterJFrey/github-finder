import { createContext, useReducer } from "react";
import githubReducer from "./GithubReducer";

const GithubContext = createContext();

const GITHUB_URL = 'https://api.github.com/search/users';

export const GithubProvider = ({children}) => {
    const initialState = {
        users: [],
        user: {},
        repos: [],
        loading: false,
    }

    const[state, dispatch] = useReducer(githubReducer, initialState);

    //Search Users  - Get search results
    const searchUsers = async (text) => {
        setLoading();
        
        const params = new URLSearchParams({
            q: text
        });

        const response = await fetch(`${GITHUB_URL}?${params}`);
        const {items} = await response.json();

        dispatch({
            type: 'GET_USERS',
            payload: items,
        });
    }

    //Get specific user
    const getUser = async(login) => {
        setLoading();
        
        const response = await fetch(`https://api.github.com/users/${login}`);
        
        if(response.status === 404) {
            window.location = '/notfound';
        }
        else {
            const data = await response.json();

            dispatch({
                type: 'GET_USER',
                payload: data,
            });
        }
    }

    //Get user repos
    const getUserRepos = async (login) => {
        setLoading();

        const params = new URLSearchParams({
            sort: 'created',
            per_page: 10
        });

        const response = await fetch(`https://api.github.com/users/${login}/repos?${params}`);
        const data = await response.json();

        dispatch({
            type: 'GET_REPOS',
            payload: data,
        });
    }

    const clearUsers = () =>  {
        setLoading();
        dispatch({
            type: 'CLEAR_USERS'
        });
    }

    const setLoading = () => dispatch({type: 'SET_LOADING'})

    return (
        <GithubContext.Provider value={{
            users: state.users,
            user: state.user,
            loading: state.loading,
            repos: state.repos,
            searchUsers,
            getUser,
            getUserRepos,
            clearUsers
        }}>
            {children}
        </GithubContext.Provider>
    );
}

export default GithubContext