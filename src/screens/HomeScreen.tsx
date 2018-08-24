import React, {Component} from 'react';
import { AsyncStorage, Button, Text, View, StyleSheet, TouchableOpacity,
          Alert, TextInput, ScrollView, Picker } from 'react-native';
import { Table, Row, Rows, Cell, TableWrapper } from 'react-native-table-component';
import  moment  from 'moment';
import BackgroundTask from 'react-native-background-task';

BackgroundTask.define(() => {
  alert('Hello from a background task')
  BackgroundTask.finish()
})

const FBSDK = require('react-native-fbsdk');
const {
  LoginManager,
} = FBSDK;

const editButton = () => (
  <TouchableOpacity>
    <View style={styles.btn}>
      <Text style={styles.btnText}>Edit</Text>
    </View>
  </TouchableOpacity>
);
let personListHeader = ['Name', 'Days Remaining', 'Frequency', 'Edit'];


enum frequency {
  twice_A_Week,
  once_A_Week,
  once_Every_Two_Weeks,
  once_Every_Three_Weeks,
  once_Every_Four_Weeks
}


interface Person {
  name: string;
  phoneNumber: string;
  lastCall: Date;
  frequency: frequency;
}

let people: Person[] = [];
let addPersonHeader = ['Add Person'];
let defaultData: Person[] = [
  {name: "Fake Name", phoneNumber: "Fake Number",
  lastCall: new Date(), frequency: frequency.once_Every_Two_Weeks,}
];
let defaultText = ['Tap Here', 'Tap Here', frequency.once_A_Week];


interface Props {

}

interface State {
  personTableData: Person[];
  addPerson: boolean;
  deletePerson: boolean;
  userInput: boolean;
  text: Object[];
  index: number;
}

export class HomeScreen extends Component<Props, State> {

  componentDidMount() {
    BackgroundTask.schedule()
  }
  
  constructor(props: Props) {
    super(props);
    
    this.state = {
      personTableData: defaultData,
      addPerson: false,
      deletePerson: false,
      userInput: false,
      text: defaultText,
      index: 0,
    }
  }
  
  static navigationOptions = {
    title: 'Call Your Mom!',
  };

  render() {
    const state = this.state;
    let addTable;
    let doneButton;
    let confirmButton;
    let changeText;

    const button = (data: String, index: number): JSX.Element => (
      <TouchableOpacity onPress={() => this._userInput(index)}>
        <View style={addPersonStyles.btn}>
          <Text style={addPersonStyles.btnText}>{data}</Text>
        </View>
      </TouchableOpacity>
    );

    const picker = () => (
      
      <Picker 
        selectedValue={this.state.text[this.state.index]}
        onValueChange={(itemValue, itemIndex) => this.setState(prevState => {
        prevState.text[prevState.index] = itemValue;
        return prevState;
        })}>

        <Picker.Item label="Twice A Week" value={frequency.twice_A_Week} />
        <Picker.Item label="Once A Week" value={frequency.once_A_Week} />
        <Picker.Item label="Once Every Two Weeks" value={frequency.once_Every_Two_Weeks} />
        <Picker.Item label="Once Every Three Weeks" value={frequency.once_Every_Three_Weeks} />
        <Picker.Item label="Once Every Four Weeks" value={frequency.once_Every_Four_Weeks} />

        </Picker>  
    )
    
    if (this.state.addPerson) {
     
      addTable = 
        <Table borderStyle={{borderColor: 'transparent'}}>
          <Row data={addPersonHeader} style={addPersonStyles.head} textStyle={addPersonStyles.text}/>
          {
              [this.state.text].map((rowData, index) => (
              <TableWrapper key={index} style={addPersonStyles.row}>
                {
                  rowData.map((cellData, cellIndex) => (
                    <Cell key={cellIndex} data={cellIndex !== 5 ? button(cellData, cellIndex) : cellData} textStyle={styles.text}/>
                  ))
                } 
              </TableWrapper>
            ))
          }
        </Table>
      
      doneButton = <Button title="Done" onPress={this._done}></Button>
    } 

    if (this.state.userInput) {
      if (this.state.index === 2) {
        changeText = picker()
      } else {
      changeText = 
      <TextInput
        style={{height: 40}}
        onChangeText={(text) => this.setState(prevState => {
          prevState.text[prevState.index] = text;

          return prevState;
        })}
        value={this.state.text[this.state.index]}
      />
      }

      confirmButton = <Button title="Confirm" onPress={(index) => this._confirm()}></Button>
    }


    let displayPersonTableData = state.personTableData.map(person => {
      const daysRemaining = this._daysLeft(person);
      return [person.name, daysRemaining, person.frequency, 'Edit'];
    });

    // console.log(JSON.stringify(displayPersonTableData));

    return (
      <ScrollView style={styles.container}>
        <Table borderStyle={{borderWidth: 2, borderColor: '#c8e1ff'}}>
          <Row data={personListHeader} style={styles.head} textStyle={styles.text}/>
          <Rows data={displayPersonTableData} textStyle={styles.text}/>
        </Table>


        <Button title="Add" onPress={this._addPersonCheck}></Button>
        <Button title="Delete" onPress={this._deletePersonCheck}></Button>
        <Button title="Show me more of the app" onPress={this._showMoreApp} />
        <Button title="Actually, sign me out :)" onPress={this._signOutAsync} />

        {addTable}
        {changeText}
        {confirmButton}
        {doneButton}
      
      </ScrollView>  
    );
  }

  _alertIndex = (index: number): void => {
    Alert.alert(`This is col ${index + 1}`);
  }

  _userInput = (index: number): void => {
    if (!this.state.userInput) {
      this.setState({
        userInput: true,
      })
    }
    this.setState({
      index: index,
    }) 
  }

  _done = (): void => {
    this.setState({
      userInput: false,
      addPerson: false,
    })
  }

  _daysLeft = (newPerson: Person): number => {
    const daysSinceLastCall = moment(newPerson.lastCall).diff(moment(), 'days');
    const frequencyNum = this._frequencyConverter(newPerson.frequency);
    const daysRemaining = frequencyNum - daysSinceLastCall;
    return daysRemaining;
  }

  _frequencyConverter = (personFrequency: frequency): number => {
    if (personFrequency === frequency.twice_A_Week) {
      return 7/2;
    } else if (personFrequency === frequency.once_A_Week) {
      return 7;
    } else if (personFrequency === frequency.once_Every_Two_Weeks) {
      return 14;
    } else if (personFrequency === frequency.once_Every_Three_Weeks) {
      return 21;
    } else {
      return 28;
    }
  }

  _confirm = (): void => {
    const newPerson = {
      name: this.state.text[0], 
      phoneNumber: this.state.text[1],
      lastCall: new Date(this.state.text[2]),
      frequency: frequency.once_A_Week,
    }

    let newPTD = this.state.personTableData;
    newPTD.push(newPerson);

    this.setState({
      personTableData: newPTD,
      userInput: false,
      text: defaultText
    })
  }

  _addPersonCheck = () => {
    if (!this.state.addPerson) {
      this.setState({
        addPerson: true,
      })
    } else {
      this.setState({
        addPerson: false,
      })
    }
  }

  _deletePersonCheck = () => {
    if (!this.state.deletePerson){
      this.setState({
        deletePerson: true,
      })
    } else {
      this.setState({
        deletePerson: false,
      })
    }
  }

  _showMoreApp = () => {
    this.props.navigation.navigate('Details');
  };

  _signOutAsync = async () => {
    LoginManager.logOut();

    await AsyncStorage.clear();
    
    this.props.navigation.navigate('Auth');
  };
}

  const styles = StyleSheet.create({
    container: { flex: 1, padding: 16, paddingTop: 30, backgroundColor: '#fff' },
    head: { height: 40, backgroundColor: '#f1f8ff' },
    text: { margin: 6, textAlign: 'center' },
    btn: { width: 58, height: 18, backgroundColor: '#78B7BB',  borderRadius: 2 },
    btnText: { textAlign: 'center', color: '#fff' }
  });

  const addPersonStyles = StyleSheet.create({
    container: { flex: 1, padding: 16, paddingTop: 30, backgroundColor: '#fff' },
    head: { height: 40, backgroundColor: 'orange' },
    text: { margin: 6, textAlign: 'center', color: 'black' },
    row: { flexDirection: 'row', backgroundColor: '#FFF1C1',},
    btn: { width: 58, height: 40, backgroundColor: '#78B7BB',  borderRadius: 2 },
    btnText: { textAlign: 'center', color: '#fff' }
  });
  