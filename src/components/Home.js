/*React*/
import { useEffect, useState } from 'react';
/*Pages*/
import Header from './Header';
import {useAuth} from '../auth/AuthContext';
/*Material*/
import { TextField, Box, Container, IconButton, Button, CssBaseline, ListItemSecondaryAction, List, ListItem, ListItemAvatar, ListItemText, Typography, CircularProgress, Alert } from '@mui/material';
import { Dialog, DialogContent, DialogContentText, DialogTitle, DialogActions } from '@mui/material';
import { SpeedDial, SpeedDialIcon } from '@mui/material';
import { addDoc, collection, deleteDoc, doc, getDoc, getFirestore, onSnapshot, orderBy, query, updateDoc, where } from 'firebase/firestore';
import AssignmentTurnedIn from '@mui/icons-material/AssignmentTurnedIn';
import PendingActions from '@mui/icons-material/PendingActions';
import DeleteIcon from '@mui/icons-material/Delete';
import Edit from '@mui/icons-material/Edit';
import CheckCircle from '@mui/icons-material/CheckCircle';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import Replay from '@mui/icons-material/Replay';

const Home = () => {

    const currentUser = useAuth(); //Get currentUser details
    const [userDetails, setUserDetails] = useState({ email: '', displayName: '' }); //Set current User details
    const [taskArray, setTaskArray] = useState([]); //For pending tasks array
    const [allTasksArray, setAllTasksArray] = useState([]); //For all tasks array
    const [editTaskArray, setEditTaskArray] = useState({taskName:'',taskDetails:''});//for getting data in edit dialog
    const [taskID, setTaskID] = useState();//Setting document id from firestore
    const [taskAddDialog, setTaskAddDialog] = useState(false); //For getting add task Dialog
    const [deleteDialog, setDeleteDialog] = useState(false); //For getting delete task Dialog
    const [editDialog, setEditDialog] = useState(false); //For getting edit task Dialog
    const [currentContent, setCurrentContent] = useState('pending'); //For changing content from pending tasks to all tasks and vice-versa
    const subText = { opacity: '0.8', fontSize: '85%', width: '60%' };//For styling task details in list
    const todayDate = new Date().toISOString().substring(0, 10);//Get current Date
    const [addTaskErrors, setAddTaskErrors] = useState({ taskDate: '', taskName: '' }); //For showing errors while adding tasks
    const [task, setTask] = useState({ taskDate: todayDate, taskName: '', taskDetails: '' }); //Setting task data in add task dialog
    const [loading, setLoading] = useState(true); //For loader
    const [alert, setAlert] = useState({ alertName: '', alertSeverity: '' }); //Setting alert for events
   
    //Check for user details changes
    useEffect(() => {
        setUserDetails({ email: currentUser.currentUser.email, displayName: currentUser.currentUser.displayName });
    }, [currentUser.currentUser]);

    //Check if pending task data changes
    useEffect(() => {
        //pending tasks query
        const taskQuery = query(collection(getFirestore(), "tasks"), where("email", "==", currentUser.currentUser.email), where("taskStatus", "==", "pending"), orderBy("taskDate","desc"));
        onSnapshot(taskQuery, (snapshot) => {
            setTaskArray(snapshot.docs.map((doc) => ({ id: doc.id, data: doc.data() })));
            setLoading(false);
        });
        return setTaskArray([]); //Cleanup function
    }, [currentUser.currentUser.email]);

    //Check if all task data changes
    useEffect(() => {
        //all tasks query
        const allTaskQuery = query(collection(getFirestore(), "tasks"), where("email", "==", currentUser.currentUser.email), orderBy("taskStatus","desc"));
        onSnapshot(allTaskQuery, (snapshot) => {
            setAllTasksArray(snapshot.docs.map((doc) => ({ id: doc.id, data: doc.data() })));
        });
        return setAllTasksArray([]); //Cleanup function
    }, [currentUser.currentUser.email]);

    //Onchange events for add task form
    const handleChange = (event) => {
        setAddTaskErrors({ taskName: '', taskDate: '' }); // Clearing Old validations
        if (event.target.id === 'taskName') {
            setTask({ taskName: event.target.value, taskDate: task.taskDate, taskDetails: task.taskDetails });
        } else if (event.target.id === 'taskDate') {
            setTask({ taskDate: event.target.value, taskName: task.taskName, taskDetails: task.taskDetails });
        } else if (event.target.id === 'taskDetails') {
            setTask({ taskDetails: event.target.value, taskName: task.taskName, taskDate: task.taskDate });
        }
    }

    //Validate add task inputs
    const addTask = (event) => {
        event.preventDefault();
        setAddTaskErrors({ taskDate: '', taskName: '' });//Clearing old Validation errors
        if (task.taskDate === '') {
            setAddTaskErrors({ taskName: '', taskDate: 'Please enter the date of Task.' });
        } else if (task.taskName === '') {
            setAddTaskErrors({ taskName: 'Please enter the Task Name.', taskDate: '' });
        } else {
            setTask({ taskName: '', taskDetails: '', taskDate: task.taskDate });
            addTaskInFirestoreFn(task.taskName, task.taskDate, task.taskDetails);
        }
    }

    //Add Task to Firestore
    async function addTaskInFirestoreFn(taskName, taskDate, taskDetails) {
        try {
            await addDoc(collection(getFirestore(), "tasks"), { taskName: taskName, taskDate: taskDate, taskDetails: taskDetails, email: currentUser.currentUser.email, taskStatus: 'pending' });
            setTaskAddDialog(false);
            setAlert({ alertName: 'Task Added Successfully!', alertSeverity: 'success' });
            setTimeout(() => { setAlert({ alertName: '', alertSeverity: '' })},5000);
        } catch (e) {
            setAlert({ alertName: 'Something went wrong! Error: '+e, alertSeverity: 'error' });
            setTimeout(() => { setAlert({ alertName: '', alertSeverity: '' }) }, 10000);
        }
    }

    //Task Completed Function
    async function taskCompleted(id){
        try {
            const updateItem = doc(getFirestore(), "tasks", id);
            await updateDoc(updateItem, {taskStatus: "completed"});
            setAlert({ alertName: 'Congrats on the task completion!', alertSeverity: 'success' });
            setTimeout(() => { setAlert({ alertName: '', alertSeverity: '' }) }, 5000);
        } catch (e) {
            setAlert({ alertName: 'Something went wrong! Error: '+e, alertSeverity: 'error' });
            setTimeout(() => { setAlert({ alertName: '', alertSeverity: '' }) }, 10000);
        }
    }

    //Task Redo Function
    async function taskRedo(id) {
        try {
            const updateItem = doc(getFirestore(), "tasks", id);
            await updateDoc(updateItem, { taskStatus: "pending" });
            setCurrentContent('pending');
            setAlert({ alertName: 'Task re-added in the List!', alertSeverity: 'info' });
            setTimeout(() => { setAlert({ alertName: '', alertSeverity: '' }) }, 5000);
        } catch (e) {
            setAlert({ alertName: 'Something went wrong! Error: '+e, alertSeverity: 'error' });
            setTimeout(() => { setAlert({ alertName: '', alertSeverity: '' }) }, 10000);
        }
    }

    //Delete Task Function
    async function deleteTask(id) {
        try {
            await deleteDoc(doc(getFirestore(), "tasks", id));
            setTaskID(null);
            setDeleteDialog(false);
            setAlert({ alertName: 'Task was deleted successfully!', alertSeverity: 'success' });
            setTimeout(() => { setAlert({ alertName: '', alertSeverity: '' }) }, 5000);
        } catch (e) {
            setAlert({ alertName: 'Something went wrong! Error: ' + e, alertSeverity: 'error' });
            setTimeout(() => { setAlert({ alertName: '', alertSeverity: '' }) }, 10000);
        }
    }

    //Get required Task for Editing
    async function showEditTask(currentTaskId) {
        const q = query(doc(getFirestore(), "tasks", currentTaskId));
        const querySnap = await getDoc(q);
        setEditTaskArray({ taskName: querySnap.data().taskName, taskDate: querySnap.data().taskDate, taskDetails: querySnap.data().taskDetails });
        setTaskID(currentTaskId);
        setEditDialog(true);
    }
    //Check Edited Inputs
    const checkEditInput = (event) => {
        if (event.target.id === 'editTaskName') {
            setEditTaskArray({ taskName: event.target.value, taskDetails: editTaskArray.taskDetails });
        } else if (event.target.id === 'editTaskDetails') {
            setEditTaskArray({ taskDetails: event.target.value, taskName: editTaskArray.taskName });
        } 
    }
    //Edit Tasks
    async function editTask(id) {
        try {
            const updateItem = doc(getFirestore(), "tasks", id);
            await updateDoc(updateItem, {
                taskName: editTaskArray.taskName,
                taskDetails: editTaskArray.taskDetails
            });
            setEditDialog(false);
            setAlert({ alertName: 'Task was edited successfully!', alertSeverity: 'info' });
            setTimeout(() => { setAlert({ alertName: '', alertSeverity: '' }) }, 5000);
        } catch (e) {
            setAlert({ alertName: 'Something went wrong! Error: ' + e, alertSeverity: 'error' });
            setTimeout(() => { setAlert({ alertName: '', alertSeverity: '' }) }, 10000);
        }
    }

    return (  
        <div>
            <Header />
            <CssBaseline />
            <Container maxWidth="md">
                <Box sx={{ bgcolor: '#eee', mt: 2, px: 2, py: 3 }}>
                    {/*Heading Box*/}
                    <Box sx={{ display: 'flex',justifyContent:'space-between' }}>
                        <Typography variant="h5">Hello {userDetails.displayName}! </Typography>
                        {currentContent === 'pending' ?
                            <Button onClick={() => setCurrentContent('all')}>See all Tasks <KeyboardArrowRight /></Button> :
                            <Button onClick={() => setCurrentContent('pending')}>See Pending Tasks <KeyboardArrowRight /></Button>
                        }
                    </Box><hr />
                    {alert.alertName && <Alert severity={alert.alertSeverity} onClose={() => setAlert([]) }>{alert.alertName}</Alert>}
                    {/*Content Box*/}
                    <Box sx={{ pt: 1 }}>
                        {currentContent === 'pending' ? <Typography variant="h6">Pending Tasks: </Typography> : <Typography variant="h6">All Tasks: </Typography>}
                        <List>
                            {
                                loading ? <CircularProgress /> :
                                currentContent === 'pending' ?
                                    (taskArray.length > 0) ?
                                        taskArray.map(({ id, data }) => (
                                            <ListItem key={id}>
                                                <ListItemAvatar><PendingActions/></ListItemAvatar>
                                                <ListItemText primary={data.taskName} secondary={data.taskDetails} secondaryTypographyProps={{ style: subText }}  />
                                                <ListItemSecondaryAction> 
                                                    <IconButton edge="end" color="success" sx={{ mr: 1 }} onClick={() => taskCompleted(id)}><CheckCircle /></IconButton>
                                                    <IconButton edge="end" color="secondary" sx={{ mr: 1 }} onClick={() => showEditTask(id) }><Edit /></IconButton>
                                                    <IconButton edge="end" color="error" onClick={() => { setDeleteDialog(true); setTaskID(id) }}><DeleteIcon /></IconButton>
                                                </ListItemSecondaryAction>
                                        </ListItem>
                                        )) :
                                    <div>No pending tasks.. </div>
                                    :
                                    (allTasksArray.length > 0) ?
                                        allTasksArray.map(({ id, data }) => (
                                            <ListItem key={id}>
                                                <ListItemAvatar><AssignmentTurnedIn /></ListItemAvatar>
                                                <ListItemText
                                                    primary={data.taskStatus === 'pending' ? data.taskName : <Typography sx={{ textDecoration: 'line-through' }}>{data.taskName}</Typography>}
                                                    secondary={data.taskDetails} secondaryTypographyProps={{style:subText}} />
                                                <ListItemSecondaryAction>
                                                    {data.taskStatus === 'pending' ?
                                                        <IconButton edge="end" color="success" sx={{ mr: 1 }} onClick={() => taskCompleted(id)}><CheckCircle /></IconButton> :
                                                        <IconButton edge="end" color="info" sx={{ mr: 1 }} onClick={() => taskRedo(id)}><Replay /></IconButton>}
                                                    <IconButton edge="end" color="secondary" sx={{ mr: 1 }} onClick={() => showEditTask(id)}><Edit /></IconButton>
                                                    <IconButton edge="end" color="error" onClick={() => { setDeleteDialog(true); setTaskID(id) }}><DeleteIcon /></IconButton>
                                                </ListItemSecondaryAction>
                                            </ListItem>
                                        )) :
                                        <div>No tasks found.. </div>
                            }
                        </List>
                    </Box>
                </Box>
                {/*Add Button at bottom*/}
                {currentUser.currentUser && <SpeedDial ariaLabel="SpeedDial basic example" sx={{ position: 'fixed', bottom: 16, right: 16 }} icon={<SpeedDialIcon />} onClick={() => setTaskAddDialog(true)}> </SpeedDial>}
                {/*Add Task Dialog*/}
                <Dialog open={taskAddDialog} onClose={() => setTaskAddDialog(false)} fullWidth maxWidth='md'>
                    <DialogTitle>{"Add New Task"}</DialogTitle>
                    <DialogContent>
                        <TextField required type="date" id="taskDate" label="Date" InputLabelProps={{ shrink: true }} value={task.taskDate} onChange={handleChange} error={addTaskErrors.taskDate !== ''} helperText={addTaskErrors.taskDate === '' ? '' : addTaskErrors.taskDate} fullWidth margin="normal" />
                        <TextField required id="taskName" label="Task" value={task.taskName} onChange={handleChange} error={addTaskErrors.taskName !== ''} helperText={addTaskErrors.taskName === '' ? '' : addTaskErrors.taskName} autoFocus fullWidth margin="normal" />
                        <TextField id="taskDetails" label="Details" multiline minRows={2} value={task.taskDetails} onChange={handleChange} fullWidth margin="normal" />
                    </DialogContent>
                    <DialogActions sx={{ pb: 2 }}>
                        <Button variant="contained" onClick={addTask}>ADD</Button>
                        <Button variant="outlined" onClick={() => setTaskAddDialog(false)}>Cancel</Button>
                    </DialogActions>
                </Dialog>
                {/*Delete Dialog*/}
                <Dialog open={deleteDialog} onClose={() => setDeleteDialog(false)} fullWidth maxWidth='md' >
                    <DialogTitle>Delete Task</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Do you really want to delete this Task permanently?
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions sx={{ pb: 2 }}>
                        <Button variant="contained" color="error" onClick={()=>deleteTask(taskID)}>Delete</Button>
                        <Button variant="outlined" onClick={ () => setDeleteDialog(false)}>Cancel</Button>
                    </DialogActions>
                </Dialog>
                {/*Edit Dialog*/}
                <Dialog open={editDialog} onClose={() => setEditDialog(false)} fullWidth maxWidth='sm' >
                    <DialogTitle>Edit Task</DialogTitle>
                    <DialogContent>
                        <TextField id="editTaskName" label="Name" margin="normal" fullWidth value={editTaskArray.taskName} onChange={checkEditInput} autoFocus></TextField>
                        <TextField id="editTaskDetails" label="Details" margin="normal" fullWidth multiline minRows={2} value={editTaskArray.taskDetails} onChange={checkEditInput} ></TextField>
                    </DialogContent>
                    <DialogActions sx={{ pb: 2 }}>
                        <Button variant="contained" color="success" onClick={() => editTask(taskID)}>Edit</Button>
                        <Button variant="outlined" onClick={() => setEditDialog(false)}>Cancel</Button>
                    </DialogActions>
                </Dialog>
            </Container>
        </div>
    );
}

export default Home;