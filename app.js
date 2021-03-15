const { createConnection } = require('mysql2')
const { prompt } = require('inquirer')

const db = createConnection('mysql://root:rootroot@localhost/great_bay_db')

const bid = () => {
  db.query('SELECT * FROM items', (err, items) => {
    prompt([
      {
        type: 'list',
        name: 'name',
        message: 'Which item do you want to bid on?',
        choices: items.map(item => ({
          name: `${item.name}`
        }))
      },
      {
        type: 'number',
        name: 'price',
        message: 'How much do you want to bid for?'
      }
    ])
      .then( ({ name, price }) => {
        let item = items.filter( data => data.name === name)
        if(price > item[0].price) {
          db.query('UPDATE items SET ? WHERE ?', [ {price}, {name} ], err => {
            if(err) { console.log(err) }
            console.log('Your bid has been successfully placed!')
            mainMenu()
          })
        } else {
          console.log('You need to place a higher bid.')
          mainMenu()
        }
      })
      .catch(err => console.log(err))
  })
}

const post = () => {
  prompt([
    {
      type: 'text',
      name: 'name',
      message: 'What are you selling?'
    },
    {
      type: 'text',
      name: 'description',
      message: 'Describe your product!'
    },
    {
      type: 'number',
      name: 'price',
      message: 'Enter your starting price.'
    }
  ])
    .then(res => {
      db.query('INSERT INTO items SET ?', res, err => {
        if (err) { console.log(err) }
        console.log('Item posted!')
        mainMenu()
      })
    })
    .catch(err => console.log(err))
}

const mainMenu = () => {
  prompt([
    {
      type: 'list',
      name: 'choice',
      message: 'What would you like to do?',
      choices: ['POST AN ITEM', 'BID ON AN ITEM', 'EXIT']
    }
  ])
    .then( ({choice}) => {
      if(choice === 'POST AN ITEM') {
        post()
      } else if  (choice === 'BID ON AN ITEM') {
        bid()
      } else {
        process.exit()
      }
    })
    .catch(err => console.log(err))
}

mainMenu()

