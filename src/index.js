class List {
    tasks;
    baseUrl;
    token;

    constructor (baseUrl) {
        this.baseUrl = baseUrl        
    }
    
    authorize(userMail) {
        fetch(`${this.baseUrl}/auth/login`, {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                value: userMail
            })
        })
        .then(response => response.json())
        .then(({access_token}) => {
            this.token = access_token;
            this.getAlltasks();
        })
        .catch(( {message} ) => console.log(message))
    }

    getAlltasks() {
        fetch(`${this.baseUrl}/todo`, {
            method: 'GET',
            headers: {
            Authorization: `Bearer ${this.token}`
            },
        })
        .then(response => response.json())
        .then(data => {
            this.tasks = data; 
        })
        .catch(( {message} ) => console.log(message))
    }

    addTask(value, priority) {
        if(this.findDublicate(value)) {
        if (value.trim() && priority) {
            fetch(`${this.baseUrl}/todo`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${this.token}`,    
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    value,
                    priority
            })
        })
        .then(response => response.json())
        .then(task => this.tasks.unshift(task))
        .catch(( {message} ) => console.log(message))
        }
        } else {
            throw new Error('This task already exists');
        }
    }

    deleteTask(id) {
        fetch(`${this.baseUrl}/todo/${id}`, {
            method: 'DELETE',
            headers: {
            Authorization: `Bearer ${this.token}`,    
            }            
        })
        .then(response => {
            if(response.status === 200) {
                const index = this.tasks.findIndex(({_id}) => id === _id);
                if (index !== -1) {
                    this.tasks.splice(index, 1);
                }
            }
        })
        .catch(( {message} ) => console.log(message))
    }

    getTask(id) {
        fetch(`${this.baseUrl}/todo/${id}`, {
            method: 'GET',
            headers: {
            Authorization: `Bearer ${this.token}`,    
            }            
        })
        .then(response => response.json())
        .then(console.log)
        .catch(( {message} ) => console.log(message))
    }

    toggleCompletion(id) {
        fetch(`${this.baseUrl}/todo/${id}/toggle`, {
            method: 'PUT',
            headers: {
                Authorization: `Bearer ${this.token}`,    
                }            
        })
        .then(response => response.json())
        .then(task => this.replaceTask(task))
        .catch(( {message} ) => console.log(message))
    }

    editTask(id, { value, priority }) {
        if (value.trim() && priority) {
            fetch(`${this.baseUrl}/todo/${id}`, {
                method: 'PUT',
                headers: {
                    Authorization: `Bearer ${this.token}`,    
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    value,
                    priority
            })
        })
        .then(response => response.json())
        .then(task => this.replaceTask(task))
        .catch(( {message} ) => console.log(message))
        }
    } 

    findDublicate(value) {
        let newTask = this.tasks.find(function(task) {
            return task.value === value;
        });
        if (newTask === undefined) {
            return true;
        } else {
            return false;
        };
    }

    replaceTask(task) {
        const index = this.tasks.findIndex(({_id}) => _id ===task._id);
        if (index !== -1) {
                this.tasks.splice(index, 1, task);
        }     
    }
}

    

   


let todo = new List('https://todo.hillel.it');

todo.authorize('thoronion@gmail.com');


