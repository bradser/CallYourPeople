import React, {Component} from 'react';
import { AsyncStorage, Button, Text, View, StyleSheet, TouchableOpacity,
          Alert, TextInput, ScrollView } from 'react-native';
import { Table, Row, Rows, Cell, TableWrapper } from 'react-native-table-component';

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
let personListHeader = ['Name', 'Days Remaining', 'Frequency', 'edit'];


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
  {name: "Fake nAME", phoneNumber: "FAKE NUMBER",
  lastCall: new Date(), frequency: frequency.once_Every_Two_Weeks,}
];


interface Props {

}

interface State {
  personTableData: Person[];
  addPerson: boolean;
  deletePerson: boolean;
  userInput: boolean;
  text: string[];
  index: number;
}

export class HomeScreen extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    
    this.state = {
      personTableData: defaultData,
      addPerson: false,
      deletePerson: false,
      userInput: false,
      text: ['Type Here', 'Type Here', 'Type Here', 'Type Here'],
      index: 0,
    }
  }
  
  static navigationOptions = {
    title: 'Call Your Mom!',
  };

  render() {
    const state = this.state;
    let addTable;
    let confirmButton;
    let submitButton;
    let changeText;

    const button = (data, index) => (
      <TouchableOpacity onPress={() => this._userInput(index)}>
        <View style={addPersonStyles.btn}>
          <Text style={addPersonStyles.btnText}>{data}</Text>
        </View>
      </TouchableOpacity>
    );
    
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
      
      confirmButton = <Button title="Confirm" onPress={this._confirm}></Button>
    }

    if (this.state.userInput) {
      changeText = 
      <TextInput
        style={{height: 40}}
        onChangeText={(text) => this.setState(prevState => {
          prevState.text[prevState.index] = text;

          return prevState;
        })}
        value={this.state.text[this.state.index]}
      />

      submitButton = <Button title="Submit" onPress={(index) => this._submit(index)}></Button>
    }


    let displayPersonTableData = state.personTableData.map(person => {
      return [person.name, person.phoneNumber, person.lastCall.toString(), person.frequency,];
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
        {submitButton}
        {confirmButton}
      
      </ScrollView>  
    );
  }

  _alertIndex(index) {
    Alert.alert(`This is col ${index + 1}`);
  }

  _userInput(index) {
    if (!this.state.userInput) {
      this.setState({
        userInput: true,
        index: index,
      })
    } else {
      if (this.state.index === 0) {
        this._alertIndex(this.state.index)
      }
      this.setState({
        userInput: false,
      })
    }
  }

  _confirm(index) {
    /*this.state.text

    into

    this.state.personTableData*/
  }

  _submit(index) {
    this.setState({
      userInput: false,
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
  