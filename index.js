const express = require('express');
const app = express();
const path = require('path');
const fetch = require('node-fetch');

const port = process.env.PORT || 5000;

const githubRepoUrl = 'https://api.github.com/users/john-espina/repos';


let projectsData = [

];

function getProjects () {
    fetch(githubRepoUrl)
        .then(res => res.json())
        .then(projects => {

            const gitHubProjects = projects.map(project => {
                return {
                    name: project.name,
                    html_url: project.html_url,
                    description: project.description
                }
            });

            projectsData = projectsData.concat(gitHubProjects);
            console.log(`Loaded ${projectsData.length} projects`);
        });
}

getProjects();

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'client/build')));

app.get('/api/projects', (req, res) => {
    // Return projects as json
    res.json(projectsData);
});

// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname+'/client/build/index.html'));
});

app.listen(port);
console.log(`My Portfolio is listening on ${port}`);
