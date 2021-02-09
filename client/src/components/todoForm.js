import React, {useState} from 'react'
import { Input, Button, Spacer,Grid } from '@geist-ui/react'


const TodoForm = ({addTodo}) => {

    const [title, setTitle] = useState("");
    const [status, setStatus] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        if(!title) return;
        console.log(title)
        addTodo(title).then(console.log("done"));
        setTitle("") 
    }

    return (
        <div>
             <Grid.Container gap={2}>
                <Grid xs={6}> <Input size="large" placeholder="Add Todo" onChange={e => setTitle(e.target.value)}/></Grid>
                <Grid xs={6}><Button size="small" shadow type="secondary" onClick={e => handleSubmit(e)}>Add</Button></Grid>
            </Grid.Container>
            <Spacer x={.5} />
            
        </div>
    )
}

export default TodoForm