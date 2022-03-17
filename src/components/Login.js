/*React*/
import { useState, useRef } from 'react';
/*Material Styles*/
import { Avatar, Button, TextField, Link, Grid, Box, Typography, Container, InputAdornment, IconButton, Backdrop, CircularProgress } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { Visibility, VisibilityOff } from "@material-ui/icons";//Password Hide Icon
import LoadingButton from '@mui/lab/LoadingButton';


const Login = () => {

	const user = useRef({ loginEmail: '', loginPassword: '', signupEmail: '', signupPassword: '', signupName: '' });
	const [login, setLogin] = useState(true);//Set Login at start
	const [showPassword, setShowPassword] = useState(false);//Password Toggle
	const [loadingButton, setLoadingButton] = useState(false);//Loader at login button
	const [loadingBackDrop, setLoadingBackdrop] = useState(false);//Full screen loader
	const [loginErrors, setLoginErrors] = useState({ email: '', password: '' });//Login Errors
	const [signupErrors, setSignupErrors] = useState({ email: '', name: '', password: '' });//Signup Errors

	/*Login Submit functions*/
	const handleSubmit = (event, type) => {
		setLoadingBackdrop(true);
		setLoadingButton(true);//Loader
		event.preventDefault();
		/*Login check*/
		if (type === 'login') {
			const email = user.current.loginEmail, password = user.current.loginPassword;
			clearValidation();//Clearing old Validation errors
			if (email === '' && password === '') {
				setLoginErrors({ email: 'Please enter some input.', password: 'Please enter some input.' });
				setLoadingButton(false);//Loader
			} else if (!/^[a-zA-Z0-9.-_]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(email)) {
				setLoginErrors({ email: 'Invalid Email' });
				setLoadingButton(false);//Loader
			} else if (!/^[a-zA-Z0-9!@#$%^&*]{6,15}$/.test(password)) {
				setLoginErrors({ password: 'Invalid Password' });
				setLoadingButton(false);//Loader
			} else {
				/*Login with firebase*/
				setLoadingButton(false);//Loader
			}
		} else if (type === 'signup') {/*Signup Check*/
			const email = user.current.signupEmail, password = user.current.signupPassword, name = user.current.signupName;
			clearValidation();//Clearing old Validation errors
			if (email === '' && password === '' && name=== '') {
				setSignupErrors({ email: 'Please enter some input.', password: 'Please enter some input.', name: 'Please enter some input.' });
			} else if (!/^[a-zA-Z0-9.-_]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(email)) {
				setSignupErrors({ email: 'Invalid Email' });
			} else if (!/^[a-zA-Z ]+$/.test(name)) {
				setSignupErrors({ name: 'Invalid Name' });
			} else if (!/^[a-zA-Z0-9!@#$%^&*]{6,15}$/.test(password)) {
				setSignupErrors({ password: 'Invalid Password' });
			} else {
				setLoadingButton(true);//Loader
				/*Signup with firebase*/
				setLoadingButton(false);//Loader
			}
		}
		setLoadingBackdrop(false);
	};

	//Clear Old Validations
	const clearValidation = () => {
		setLoginErrors({ email: '', password: '' });
		setSignupErrors({ email: '', name: '', password: '' });
	}

	//OnChange signup inputs
	const checkInputs = (event) => {
		clearValidation();//Clearing old Validation errors
		if (event.target.id === 'login-email') {
			user.current.loginEmail = event.target.value;
			if (!/^[a-zA-Z0-9.-_]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(event.target.value)) { setLoginErrors({ email: 'Invalid Email', password: loginErrors.password }); }
		} else if (event.target.id === 'login-password') {
			user.current.loginPassword = event.target.value;
			if (!/^[a-zA-Z0-9!@#$%^&*]{6,15}$/.test(event.target.value)) { setLoginErrors({ email: loginErrors.email, password: 'Minimum 6 charecters / Invalid Password' }); }
		} if (event.target.id === 'signup-email') {
			user.current.signupEmail = event.target.value;
			if (!/^[a-zA-Z0-9.-_]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(event.target.value)) { setSignupErrors({ email: 'Invalid Email', password: signupErrors.password, name: signupErrors.name }); }
		} else if (event.target.id === 'signup-name') {
			user.current.signupName = event.target.value;
			if (!/^[a-zA-Z ]+$/.test(event.target.value)) { setSignupErrors({ name: 'Name must have only alphabets', email: signupErrors.email, password: signupErrors.password }); }
		} else if (event.target.id === 'signup-password') {
			user.current.signupPassword = event.target.value;
			if (!/^[a-zA-Z0-9!@#$%^&*]{6,15}$/.test(event.target.value)) { setSignupErrors({ password: 'Minimum 6 charecters / Invalid Password', email: signupErrors.email, name: signupErrors.name }); }
		}
	}

	return (
		<div>
			{/*Backdrop full screen loader*/}
			<Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={loadingBackDrop}>
				<CircularProgress color="inherit" />
			</Backdrop>
			<Container component="main" maxWidth="xs">
				{/*Login and Signup Div*/}
				<Box sx={{ marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
					{/*Header Icon and Name*/}
					<Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
						<LockOutlinedIcon />
					</Avatar>
					{/*Login Form*/}
					{login &&
						<div>
							<Typography component="h1" variant="h5">Sign in</Typography>
							<Box component="form" onSubmit={(event) => handleSubmit(event, 'login')} noValidate sx={{ mt: 1 }} id="loginForm">
								<TextField ref={user.loginEmail} margin="normal" required fullWidth id="login-email" label="Email Address" name="email" autoComplete="email username" autoFocus error={loginErrors.email !== ''} helperText={loginErrors.email === '' ? '' : (loginErrors.email)} onChange={checkInputs} />
								<TextField ref={user.loginPassword} margin="normal" required fullWidth id="login-password" label="Password" name="password" autoComplete="current-password" error={loginErrors.password !== ''} helperText={loginErrors.password === '' ? '' : (loginErrors.password)} onChange={checkInputs} type={showPassword ? "text" : "password"}
									InputProps={{
										endAdornment: (
											<InputAdornment position="end">
												<IconButton aria-label="toggle password visibility" onClick={() => { setShowPassword(!showPassword) }} onMouseDown={() => { setShowPassword(!showPassword) }}>
													{showPassword ? <Visibility /> : <VisibilityOff />}
												</IconButton>
											</InputAdornment>
										)
									}}
								/>
								<LoadingButton type="submit" fullWidth variant="contained" loading={loadingButton} sx={{ mt: 3, mb: 1 }}>Sign In</LoadingButton>
								<Button type="button" fullWidth variant="outlined" color="success" sx={{ mt: 1, mb: 2 }}>Sign In with Google</Button>
							</Box>
							<Grid container>
								<Grid item xs={4} sx={{ textAlign: 'left' }}><Link component="button" variant="body2">Forgot password?</Link></Grid>
							<Grid item xs={8} sx={{ textAlign: 'right' }}><Link component="button" variant="body2" onClick={() => { setLogin(false) }}>Don't have an account? Sign Up</Link></Grid>
							</Grid>
						</div>
					}
					{/*Signup Form*/}
					{!login &&
						<div>
							<Typography component="h1" variant="h5">Sign Up</Typography>
							<Box component="form" onSubmit={(event) => handleSubmit(event, 'signup')} noValidate sx={{ mt: 1 }}>
								<TextField sx={{ display: 'none' }} margin="normal" fullWidth id="signup-username" label="Username" name="username" autoComplete="username" />{/*For Username Requirement Warning*/}
								<TextField ref={user.signupEmail} margin="normal" required fullWidth id="signup-email" label="Email Address" name="email" autoComplete="email username" autoFocus error={signupErrors.email !== ''} helperText={signupErrors.email === '' ? '' : (signupErrors.email)} onChange={checkInputs} />
								<TextField ref={user.signupPassword} margin="normal" required fullWidth id="signup-name" label="Full Name" name="name" autoComplete="name" error={signupErrors.name !== ''} helperText={signupErrors.name === '' ? '' : (signupErrors.name)} onChange={checkInputs} />
								<TextField ref={user.signupName} margin="normal" required fullWidth id="signup-password" label="Password" name="password" autoComplete="current-password" error={signupErrors.password !== ''} helperText={signupErrors.password === '' ? '' : signupErrors.password} onChange={checkInputs} type={showPassword ? "text" : "password"}
									InputProps={{
										endAdornment: (
											<InputAdornment position="end">
												<IconButton aria-label="toggle password visibility" onClick={() => { setShowPassword(!showPassword) }} onMouseDown={() => { setShowPassword(!showPassword) }}>
													{showPassword ? <Visibility /> : <VisibilityOff />}
												</IconButton>
											</InputAdornment>
										)
									}}
								/>
								<Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>Sign Up</Button>
								<Button type="button" fullWidth variant="outlined" color="success" sx={{ mt: 1, mb: 2 }}>Sign Up with Google</Button>
							</Box>
							<Grid container>
								<Grid item xs={2}></Grid>
								<Grid item xs={10} sx={{ textAlign: 'right' }}><Link variant="body2" component="button" onClick={() => { setLogin(true) }}>Already have an account? Login</Link></Grid>
							</Grid>
						</div>
					}
				</Box>
			</Container>
        </div>
    );
}

export default Login;