const inquirer = require("inquirer");
const fs = require("fs");
const util = require("util");
const generateMd = require("./utils/generateMarkdown");

const writeFileAsync = util.promisify(fs.writeFile);

// function to make input required
function makeRequiredFieldValidator(fieldname){

  return function (input, answers) {
    if (input === "") {
      return "Please make sure " + fieldname + " has been entered";
    } else {
      return true;
    }
  }
}

// questions
const questions = [
  {
    type: "input",
    message: "What is the project title?",
    name: "projectTitle",
    validate: makeRequiredFieldValidator("a title"),
  },
  {
    type: "confirm",
    message: "Would you like a description guide?",
    name: "needGuide",
  },  
  // only show if "Would you like a description guide?" in entered as Y
  {
    type: "input",
    message: "Why did you build this project?",
    name: "descriptionWhy",
    validate: makeRequiredFieldValidator("an input"),
    when: function(answers){
      return answers.needGuide;
    }
  },
  {
    type: "input",
    message: "What problem does it solve?",
    name: "descriptionWhat",
    validate: makeRequiredFieldValidator("an input"),
    when: function(answers){
      return answers.needGuide;
    }
  },
  {
    type: "input",
    message: "What did you learn?",
    name: "descriptionLearn",
    validate: makeRequiredFieldValidator("an input"),
    when: function(answers){
      return answers.needGuide;
    }
  },
    // only show if "Would you like a description guide?" in entered as N
    {
      type: "input",
      message: "Please enter a basic description of your project",
      name: "description",
      validate: makeRequiredFieldValidator("a description"),
      when: function(answers){
        return !answers.needGuide;
      }
    },
  {
    type: "input",
    message: "Describe the installation process if any: ",
    name: "installation",
    validate: makeRequiredFieldValidator("an installation process"),
  },
  {
    type: "input",
    message: "How is the project used, images from the assets/images/ will also be",
    validate: makeRequiredFieldValidator("an input"),
    name: "usage",
  },
  {
    type: "list",
    message: "Chose the appropriate license for this project: ",
    choices: [
      "MIT", 
      "APACHE 2.0", 
      "GPL 3.0", 
      "BSD 3",
    ],
    name: "license",
  },
  {
    type: "input",
    message: "Who are the contributors of this projects?",
    name: "contribute",
    validate: makeRequiredFieldValidator("a contributor"),
  },
  {
    type: "confirm",
    message: "Is there a test included?",
    name: "tests",
  },
  {
    type: "input",
    message: "What do I do if I have an issue? ",
    name: "questions",
  },
  {
    type: "input",
    message: "Please enter your GitHub username: ",
    name: "username",
  },
  {
    type: "input",
    message: "Please enter your email: ",
    name: "email",
  }
]

// function to prompt user - returns answers object
const promptUser = () => {
  return inquirer
    .prompt(questions);
}

// function to write README file
const writeToFile = (fileName, data) => {
  return writeFileAsync(fileName, data);
}

const init = async () => {
  try {
    console.log("Welcome to the README generator.\nPlease answer the following questions:")
    // ask questions
    const answers = await promptUser();
    // create markdown from user answers
    const fileContent = generateMd(answers);
    // write file to
    await writeToFile("./output/README.md", fileContent);
    // notify user that file has been written
    console.log("README.md created 😊");

  } catch (err) {
    // notify user that file did not create
    console.error("Error creating README. File not created 😞");
    console.log(err);
  }
}

// initialize
init();
