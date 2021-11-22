import './App.css';
import { useEffect, useState } from 'react';
import ListOfTodo from './components/ListOfTodo';
import { getAuth, signInWithPopup, onAuthStateChanged, GoogleAuthProvider } from "firebase/auth";
const provider = new GoogleAuthProvider();
function App() {
	provider.addScope('https://www.googleapis.com/auth/contacts.readonly');
	const [auth, setAuth] = useState(
		false || window.localStorage.getItem('auth') === 'true'
	);
	const [token, setToken] = useState(localStorage.getItem('token'));
	const [uid, setuid] = useState(localStorage.getItem('uid'));

	useEffect(() => {
		const authw = getAuth();
		onAuthStateChanged(authw, (user) => {
			if (user) {
				const uid = user.uid;
				setToken(user.accessToken);
				setuid(user.uid);
				localStorage.setItem('token',user.accessToken)
				localStorage.setItem('uid',user.uid)
			} else {

			}
		});
	}, []);

	const loginWithGoogle = () => {
		const authw = getAuth();
		signInWithPopup(authw, provider)
			.then((result) => {
				// This gives you a Google Access Token. You can use it to access the Google API.
				const credential = GoogleAuthProvider.credentialFromResult(result);
				const tokens = credential.accessToken;
				// The signed-in user info.
				const user = result.user;
				setToken(tokens);
				setToken(user.accessToken);
				console.log(user)
				setuid(user.uid);
				localStorage.setItem('token',tokens)
				localStorage.setItem('uid',user.uid)
				window.localStorage.setItem('auth', 'true');
				// ...
			}).catch((error) => {
				// Handle Errors here.
				const errorCode = error.code;
				const errorMessage = error.message;
				// The email of the user's account used.
				const email = error.email;
				// The AuthCredential type that was used.
				const credential = GoogleAuthProvider.credentialFromError(error);
				// ...
			});
	};

	return (
		<div className="App">
			{/* {auth ? ( */}
				<ListOfTodo token={token} uid={uid}/>
			{/* ) : (
				<button onClick={loginWithGoogle}>Login with Google</button>
			)} */}
		</div>
	);
}

export default App;
