import React, {Component} from 'react';
import { AsyncStorage, Button, Text, View, StyleSheet, TouchableOpacity,
          Alert, TextInput } from 'react-native';
import { Table, Row, Rows, Cell, TableWrapper } from 'react-native-table-component';

const FBSDK = require('react-native-fbsdk');
const {
  LoginManager,
} = FBSDK;


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
  {name: "Fake nAME", phoneNumber: "FAKE NUMBER",
  lastCall: new Date(), frequency: frequency.once_Every_Two_Weeks}
];


interface Props {

}

interface State {
  personTableData: Person[];
  addPerson: boolean;
  deletePerson: boolean;
  addPersonTableData: Person[];
}

export class HomeScreen extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    
    this.state = {
      personTableData: people,
      addPerson: false,
      deletePerson: false,
      addPersonTableData: defaultData,
    }
  }
  
  static navigationOptions = {
    title: 'Call Your Mom!',
  };

    
    
    render() {
      const state = this.state;
      let addTable;
      let confirmButton;
      let deleteTable;

      if (this.state.addPerson) {
        let displayAddPersonTableData = state.addPersonTableData.map(person => {
          return [person.name, person.phoneNumber, person.lastCall.toString(), person.frequency];
        });
        
        addTable = 
        <TouchableOpacity onPress={this._alertIndex}>
        <Table borderStyle={{borderWidth: 2, borderColor: '#c8e1ff'}}>
          <Row data={addPersonHeader} style={addPersonStyles.head} textStyle={addPersonStyles.text}/>
          <Rows data={displayAddPersonTableData} textStyle={addPersonStyles.text} />
        </Table>
        </TouchableOpacity>

        confirmButton = <Button title="Confirm" onPress={this._addPersonCheck}></Button>
      }
      if (this.state.deletePerson) {
        deleteTable;
      }

      let displayPersonTableData = state.personTableData.map(person => {
        return [person.name, person.phoneNumber, person.lastCall.toString(), person.frequency];
      });

     // console.log(JSON.stringify(displayPersonTableData));

      return (
        <View style={styles.container}>
          <Table borderStyle={{borderWidth: 2, borderColor: '#c8e1ff'}}>
            <Row data={personListHeader} style={styles.head} textStyle={styles.text}/>
            <Rows data={displayPersonTableData} textStyle={styles.text}/>
          </Table>


          <Button title="Add" onPress={this._addPersonCheck}></Button>
          <Button title="Delete" onPress={this._deletePersonCheck}></Button>
          <Button title="Show me more of the app" onPress={this._showMoreApp} />
          <Button title="Actually, sign me out :)" onPress={this._signOutAsync} />

          {addTable}
          {confirmButton}
         
          
        </View>
        
      );
    }

    _alertIndex() {
      Alert.alert(`Yay`);
    }

    _addPersonCheck = () => {
      if (!this.state.addPerson) {
        this.setState({
          addPerson: true,
        })
      } else {
        for (let i = 0; i < this.state.addPersonTableData.length; i++) {
          people.push(this.state.addPersonTableData[i]);
        }
        this.setState({
          personTableData: people,
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
    text: { margin: 6, textAlign: 'center' }
  });

  const addPersonStyles = StyleSheet.create({
    container: { flex: 1, padding: 16, paddingTop: 30, backgroundColor: '#fff' },
    head: { height: 40, backgroundColor: 'orange' },
    text: { margin: 6, textAlign: 'center', color: 'black' },
    row: { flexDirection: 'row', backgroundColor: '#FFF1C1' },
    btn: { width: 58, height: 18, backgroundColor: '#78B7BB',  borderRadius: 2 },
    btnText: { textAlign: 'center', color: '#fff' }
  });
  