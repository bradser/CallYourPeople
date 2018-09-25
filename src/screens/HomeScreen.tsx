import React, { Component } from "react";
import {
  AsyncStorage,
  Button,
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Alert,
  TextInput,
  ScrollView,
  Picker
} from "react-native";
import {
  Table,
  Row,
  Rows,
  Cell,
  TableWrapper
} from "react-native-table-component";
import moment from "moment";
import BackgroundTask from "react-native-background-task";
import { Frequency, Person } from "../Types";
import {
  frequencyConverter,
  daysLeft,
  checkPeople,
  checkCallLog
} from "../AppLogic";
import { default as getLog } from "./../CallLog";

BackgroundTask.define(() => {
  alert("Hello from a background task");
  BackgroundTask.finish();
});

const FBSDK = require("react-native-fbsdk");
const { LoginManager } = FBSDK;

const editButton = () => (
  <TouchableOpacity>
    <View style={styles.btn}>
      <Text style={styles.btnText}>Edit</Text>
    </View>
  </TouchableOpacity>
);
let personListHeader = ["Name", "Days Remaining", "Frequency", "Delete"];

let people: Person[] = [];
let addPersonHeader = ["Add Person"];

let defaultData: Person[] = [
  {
    name: "Fake Name 1",
    phoneNumber: "2063999572",
    lastCall: moment("2018-08-19"),
    frequency: Frequency.once_A_Week, 
    shouldAlert: true
  },

  {
    name: "Fake Name 2",
    phoneNumber: "2066843000",
    lastCall: moment("2018-08-19"),
    frequency: Frequency.once_A_Week,
    shouldAlert: true
  },

  /*{
    name: "Fake Name 3",
    phoneNumber: "Fake Number",
    lastCall: moment("2013-01-01"),
    frequency: Frequency.once_Every_Two_Weeks,
    shouldAlert: true
  },

  {
    name: "Fake Name 4",
    phoneNumber: "Fake Number",
    lastCall: moment("2013-01-31"),
    frequency: Frequency.once_Every_Two_Weeks,
    shouldAlert: true
  },

  {
    name: "Fake Name 5",
    phoneNumber: "Fake Number",
    lastCall: moment("2013-02-02"),
    frequency: Frequency.once_Every_Two_Weeks,
    shouldAlert: false
  },

  {
    name: "Fake Name 6",
    phoneNumber: "Fake Number",
    lastCall: moment("1998-11-24"),
    frequency: Frequency.once_Every_Two_Weeks,
    shouldAlert: true
  }*/
];
let defaultText = ["Tap Here", "Tap Here", Frequency.once_A_Week];

const fakeCallLog = [
  {
    phoneNumber: "2063999572",
    callType: "OUTGOING",
    callDate: "1535332546875",
    callDuration: "9",
    callDayTime: "Sun Aug 26 18:15:46 PDT 2018",
    cachedName: "Jeannette Legault"
  },
  {
    phoneNumber: "+12069573976",
    callType: "OUTGOING",
    callDate: "1535332526287",
    callDuration: "5",
    callDayTime: "Sun Aug 26 18:15:26 PDT 2018",
    cachedName: "Jeannette Legault"
  },
  {
    phoneNumber: "2066843000",
    callType: "OUTGOING",
    callDate: "1535131690626",
    callDuration: "207",
    callDayTime: "Fri Aug 24 10:28:10 PDT 2018"
  },
  {
    phoneNumber: "2066843000",
    callType: "OUTGOING",
    callDate: "1535131611561",
    callDuration: "23",
    callDayTime: "Fri Aug 24 10:26:51 PDT 2018"
  },
  {
    phoneNumber: "+12028602474",
    callDate: "1535063757137",
    callDuration: "0",
    callDayTime: "Thu Aug 23 15:35:57 PDT 2018"
  },
  {
    phoneNumber: "+13132096269",
    callType: "OUTGOING",
    callDate: "1535056300192",
    callDuration: "71",
    callDayTime: "Thu Aug 23 13:31:40 PDT 2018"
  },
  {
    phoneNumber: "+13132096269",
    callType: "INCOMING",
    callDate: "1535056240515",
    callDuration: "46",
    callDayTime: "Thu Aug 23 13:30:40 PDT 2018"
  },
  {
    phoneNumber: "+12026648621",
    callDate: "1535041054642",
    callDuration: "0",
    callDayTime: "Thu Aug 23 09:17:34 PDT 2018"
  },
  {
    phoneNumber: "+12065820768",
    callType: "MISSED",
    callDate: "1534979515454",
    callDuration: "0",
    callDayTime: "Wed Aug 22 16:11:55 PDT 2018"
  },
  {
    phoneNumber: "+12028602471",
    callType: "MISSED",
    callDate: "1534977847593",
    callDuration: "0",
    callDayTime: "Wed Aug 22 15:44:07 PDT 2018"
  },
  {
    phoneNumber: "+12026648621",
    callDate: "1534959391456",
    callDuration: "0",
    callDayTime: "Wed Aug 22 10:36:31 PDT 2018"
  },
  {
    phoneNumber: "+12028602484",
    callDate: "1534900179924",
    callDuration: "0",
    callDayTime: "Tue Aug 21 18:09:39 PDT 2018"
  },
  {
    phoneNumber: "+12028602460",
    callDate: "1534873950242",
    callDuration: "0",
    callDayTime: "Tue Aug 21 10:52:30 PDT 2018"
  },
  {
    phoneNumber: "+12062954055",
    callType: "INCOMING",
    callDate: "1534867769967",
    callDuration: "28",
    callDayTime: "Tue Aug 21 09:09:29 PDT 2018",
    cachedName: "Shelley McIntyre"
  },
  {
    phoneNumber: "2087242911",
    callType: "OUTGOING",
    callDate: "1534823904368",
    callDuration: "857",
    callDayTime: "Mon Aug 20 20:58:24 PDT 2018",
    cachedName: "Andi Wallace"
  },
  {
    phoneNumber: "+12064506878",
    callType: "INCOMING",
    callDate: "1534816155813",
    callDuration: "845",
    callDayTime: "Mon Aug 20 18:49:15 PDT 2018",
    cachedName: "Brian Bennink"
  },
  {
    phoneNumber: "+12064506878",
    callType: "MISSED",
    callDate: "1534800469269",
    callDuration: "0",
    callDayTime: "Mon Aug 20 14:27:49 PDT 2018",
    cachedName: "Brian Bennink"
  },
  {
    phoneNumber: "+14257851268",
    callType: "OUTGOING",
    callDate: "1534785183593",
    callDuration: "6",
    callDayTime: "Mon Aug 20 10:13:03 PDT 2018"
  },
  {
    phoneNumber: "+14257851268",
    callType: "MISSED",
    callDate: "1534785147598",
    callDuration: "0",
    callDayTime: "Mon Aug 20 10:12:27 PDT 2018"
  },
  {
    phoneNumber: "+12028602481",
    callType: "MISSED",
    callDate: "1534714253082",
    callDuration: "0",
    callDayTime: "Sun Aug 19 14:30:53 PDT 2018"
  },
  {
    phoneNumber: "+14252155672",
    callDate: "1534710815899",
    callDuration: "0",
    callDayTime: "Sun Aug 19 13:33:35 PDT 2018",
    cachedName: "Sophia Mizuki Urabe"
  },
  {
    phoneNumber: "+12028602457",
    callType: "MISSED",
    callDate: "1534710600964",
    callDuration: "0",
    callDayTime: "Sun Aug 19 13:30:00 PDT 2018"
  },
  {
    phoneNumber: "2064506878",
    callType: "OUTGOING",
    callDate: "1534706558162",
    callDuration: "189",
    callDayTime: "Sun Aug 19 12:22:38 PDT 2018",
    cachedName: "Brian Bennink"
  },
  {
    phoneNumber: "+12064506878",
    callType: "OUTGOING",
    callDate: "1534697627845",
    callDuration: "2",
    callDayTime: "Sun Aug 19 09:53:47 PDT 2018",
    cachedName: "Brian Bennink"
  },
  {
    phoneNumber: "+12026648621",
    callDate: "1534635670975",
    callDuration: "0",
    callDayTime: "Sat Aug 18 16:41:10 PDT 2018"
  },
  {
    phoneNumber: "+14257851061",
    callDate: "1534633725500",
    callDuration: "0",
    callDayTime: "Sat Aug 18 16:08:45 PDT 2018"
  },
  {
    phoneNumber: "+14257851147",
    callType: "MISSED",
    callDate: "1534610208392",
    callDuration: "0",
    callDayTime: "Sat Aug 18 09:36:48 PDT 2018"
  },
  {
    phoneNumber: "+12028602481",
    callType: "MISSED",
    callDate: "1534554578540",
    callDuration: "0",
    callDayTime: "Fri Aug 17 18:09:38 PDT 2018"
  },
  {
    phoneNumber: "2067071030",
    callType: "OUTGOING",
    callDate: "1534545036615",
    callDuration: "0",
    callDayTime: "Fri Aug 17 15:30:36 PDT 2018"
  },
  {
    phoneNumber: "+12026648621",
    callDate: "1534535797081",
    callDuration: "0",
    callDayTime: "Fri Aug 17 12:56:37 PDT 2018"
  },
  {
    phoneNumber: "+14252509204",
    callType: "MISSED",
    callDate: "1534528345250",
    callDuration: "0",
    callDayTime: "Fri Aug 17 10:52:25 PDT 2018"
  },
  {
    phoneNumber: "+13022020169",
    callType: "MISSED",
    callDate: "1534453487705",
    callDuration: "0",
    callDayTime: "Thu Aug 16 14:04:47 PDT 2018"
  },
  {
    phoneNumber: "+14254341319",
    callType: "INCOMING",
    callDate: "1534371678431",
    callDuration: "23",
    callDayTime: "Wed Aug 15 15:21:18 PDT 2018"
  },
  {
    phoneNumber: "+14254341319",
    callDate: "1534371642559",
    callDuration: "0",
    callDayTime: "Wed Aug 15 15:20:42 PDT 2018"
  },
  {
    phoneNumber: "+14254717415",
    callType: "MISSED",
    callDate: "1534272220737",
    callDuration: "0",
    callDayTime: "Tue Aug 14 11:43:40 PDT 2018"
  },
  {
    phoneNumber: "+12062954055",
    callType: "OUTGOING",
    callDate: "1534262483456",
    callDuration: "12",
    callDayTime: "Tue Aug 14 09:01:23 PDT 2018",
    cachedName: "Shelley McIntyre"
  },
  {
    phoneNumber: "+12063505352",
    callType: "INCOMING",
    callDate: "1534194998687",
    callDuration: "39",
    callDayTime: "Mon Aug 13 14:16:38 PDT 2018"
  },
  {
    phoneNumber: "+14252417064",
    callType: "OUTGOING",
    callDate: "1534181928163",
    callDuration: "0",
    callDayTime: "Mon Aug 13 10:38:48 PDT 2018"
  },
  {
    phoneNumber: "+18003226409",
    callType: "MISSED",
    callDate: "1534181867783",
    callDuration: "0",
    callDayTime: "Mon Aug 13 10:37:47 PDT 2018"
  },
  {
    phoneNumber: "+12062954055",
    callType: "OUTGOING",
    callDate: "1534093344525",
    callDuration: "15",
    callDayTime: "Sun Aug 12 10:02:24 PDT 2018",
    cachedName: "Shelley McIntyre"
  },
  {
    phoneNumber: "+14012698390",
    callDate: "1533938922292",
    callDuration: "0",
    callDayTime: "Fri Aug 10 15:08:42 PDT 2018"
  },
  {
    phoneNumber: "+12063505352",
    callType: "INCOMING",
    callDate: "1533938668596",
    callDuration: "75",
    callDayTime: "Fri Aug 10 15:04:28 PDT 2018"
  },
  {
    phoneNumber: "+12064506868",
    callType: "OUTGOING",
    callDate: "1533930650265",
    callDuration: "20",
    callDayTime: "Fri Aug 10 12:50:50 PDT 2018"
  },
  {
    phoneNumber: "+12064506868",
    callType: "INCOMING",
    callDate: "1533930611822",
    callDuration: "24",
    callDayTime: "Fri Aug 10 12:50:11 PDT 2018"
  },
  {
    phoneNumber: "+12064506868",
    callType: "INCOMING",
    callDate: "1533928265335",
    callDuration: "18",
    callDayTime: "Fri Aug 10 12:11:05 PDT 2018"
  },
  {
    phoneNumber: "8447322466",
    callType: "OUTGOING",
    callDate: "1533927127342",
    callDuration: "120",
    callDayTime: "Fri Aug 10 11:52:07 PDT 2018"
  },
  {
    phoneNumber: "+12062954055",
    callType: "INCOMING",
    callDate: "1533870817304",
    callDuration: "9",
    callDayTime: "Thu Aug 09 20:13:37 PDT 2018",
    cachedName: "Shelley McIntyre"
  },
  {
    phoneNumber: "+12062954055",
    callType: "OUTGOING",
    callDate: "1533870767498",
    callDuration: "2",
    callDayTime: "Thu Aug 09 20:12:47 PDT 2018",
    cachedName: "Shelley McIntyre"
  },
  {
    phoneNumber: "+12062954055",
    callType: "MISSED",
    callDate: "1533870528717",
    callDuration: "0",
    callDayTime: "Thu Aug 09 20:08:48 PDT 2018",
    cachedName: "Shelley McIntyre"
  },
  {
    phoneNumber: "+12062954055",
    callType: "INCOMING",
    callDate: "1533868970740",
    callDuration: "91",
    callDayTime: "Thu Aug 09 19:42:50 PDT 2018",
    cachedName: "Shelley McIntyre"
  },
  {
    phoneNumber: "+12064506868",
    callType: "INCOMING",
    callDate: "1533839258261",
    callDuration: "51",
    callDayTime: "Thu Aug 09 11:27:38 PDT 2018"
  },
  {
    phoneNumber: "+12064506868",
    callType: "INCOMING",
    callDate: "1533821392739",
    callDuration: "62",
    callDayTime: "Thu Aug 09 06:29:52 PDT 2018"
  },
  {
    phoneNumber: "+12064506868",
    callType: "MISSED",
    callDate: "1533821308378",
    callDuration: "0",
    callDayTime: "Thu Aug 09 06:28:28 PDT 2018"
  },
  {
    phoneNumber: "+12064506868",
    callType: "MISSED",
    callDate: "1533821247183",
    callDuration: "0",
    callDayTime: "Thu Aug 09 06:27:27 PDT 2018"
  },
  {
    phoneNumber: "+14252774228",
    callDate: "1533778092046",
    callDuration: "0",
    callDayTime: "Wed Aug 08 18:28:12 PDT 2018"
  },
  {
    phoneNumber: "+14256873583",
    callType: "MISSED",
    callDate: "1533772114308",
    callDuration: "0",
    callDayTime: "Wed Aug 08 16:48:34 PDT 2018"
  },
  {
    phoneNumber: "+12062954055",
    callType: "OUTGOING",
    callDate: "1533743145439",
    callDuration: "76",
    callDayTime: "Wed Aug 08 08:45:45 PDT 2018",
    cachedName: "Shelley McIntyre"
  },
  {
    phoneNumber: "+12062954055",
    callType: "OUTGOING",
    callDate: "1533743111252",
    callDuration: "2",
    callDayTime: "Wed Aug 08 08:45:11 PDT 2018",
    cachedName: "Shelley McIntyre"
  },
  {
    phoneNumber: "+12067199499",
    callType: "INCOMING",
    callDate: "1533741381288",
    callDuration: "21",
    callDayTime: "Wed Aug 08 08:16:21 PDT 2018"
  },
  {
    phoneNumber: "+12064506868",
    callType: "INCOMING",
    callDate: "1533676899685",
    callDuration: "65",
    callDayTime: "Tue Aug 07 14:21:39 PDT 2018"
  },
  {
    phoneNumber: "+13603771300",
    callType: "INCOMING",
    callDate: "1533670513554",
    callDuration: "86",
    callDayTime: "Tue Aug 07 12:35:13 PDT 2018"
  },
  {
    phoneNumber: "+17345464450",
    callType: "OUTGOING",
    callDate: "1533659812688",
    callDuration: "1345",
    callDayTime: "Tue Aug 07 09:36:52 PDT 2018",
    cachedName: "Tad Blankenburg"
  },
  {
    phoneNumber: "+17345464450",
    callDate: "1533659770367",
    callDuration: "0",
    callDayTime: "Tue Aug 07 09:36:10 PDT 2018",
    cachedName: "Tad Blankenburg"
  },
  {
    phoneNumber: "+14252774228",
    callType: "INCOMING",
    callDate: "1533658929513",
    callDuration: "207",
    callDayTime: "Tue Aug 07 09:22:09 PDT 2018"
  },
  {
    phoneNumber: "+12062954055",
    callType: "MISSED",
    callDate: "1533612217010",
    callDuration: "0",
    callDayTime: "Mon Aug 06 20:23:37 PDT 2018",
    cachedName: "Shelley McIntyre"
  },
  {
    phoneNumber: "+14258814106",
    callType: "INCOMING",
    callDate: "1533594993079",
    callDuration: "218",
    callDayTime: "Mon Aug 06 15:36:33 PDT 2018"
  },
  {
    phoneNumber: "2067837288",
    callType: "OUTGOING",
    callDate: "1533594663779",
    callDuration: "92",
    callDayTime: "Mon Aug 06 15:31:03 PDT 2018"
  },
  {
    phoneNumber: "+12067848101",
    callType: "OUTGOING",
    callDate: "1533593867334",
    callDuration: "24",
    callDayTime: "Mon Aug 06 15:17:47 PDT 2018"
  },
  {
    phoneNumber: "+12066827328",
    callType: "INCOMING",
    callDate: "1533340399431",
    callDuration: "48",
    callDayTime: "Fri Aug 03 16:53:19 PDT 2018"
  },
  {
    phoneNumber: "+12064506868",
    callType: "INCOMING",
    callDate: "1533327480254",
    callDuration: "234",
    callDayTime: "Fri Aug 03 13:18:00 PDT 2018"
  },
  {
    phoneNumber: "+12067848101",
    callType: "OUTGOING",
    callDate: "1533322967735",
    callDuration: "124",
    callDayTime: "Fri Aug 03 12:02:47 PDT 2018"
  },
  {
    phoneNumber: "+12067848101",
    callType: "MISSED",
    callDate: "1533322907110",
    callDuration: "0",
    callDayTime: "Fri Aug 03 12:01:47 PDT 2018"
  },
  {
    phoneNumber: "+18102411276",
    callType: "OUTGOING",
    callDate: "1533322406897",
    callDuration: "542",
    callDayTime: "Fri Aug 03 11:53:26 PDT 2018",
    cachedName: "Gayle Serbus"
  },
  {
    phoneNumber: "9896895334",
    callType: "OUTGOING",
    callDate: "1533322386181",
    callDuration: "0",
    callDayTime: "Fri Aug 03 11:53:06 PDT 2018",
    cachedName: "Joe and Gayle Serbus"
  },
  {
    phoneNumber: "+14252417064",
    callType: "OUTGOING",
    callDate: "1533319634118",
    callDuration: "2",
    callDayTime: "Fri Aug 03 11:07:14 PDT 2018"
  },
  {
    phoneNumber: "+18553308653",
    callDate: "1533319588417",
    callDuration: "0",
    callDayTime: "Fri Aug 03 11:06:28 PDT 2018"
  },
  {
    phoneNumber: "+14257852687",
    callDate: "1533234475293",
    callDuration: "0",
    callDayTime: "Thu Aug 02 11:27:55 PDT 2018"
  },
  {
    phoneNumber: "+14257863730",
    callDate: "1533156073958",
    callDuration: "0",
    callDayTime: "Wed Aug 01 13:41:13 PDT 2018"
  },
  {
    phoneNumber: "+12062954055",
    callType: "OUTGOING",
    callDate: "1533000482197",
    callDuration: "19",
    callDayTime: "Mon Jul 30 18:28:02 PDT 2018",
    cachedName: "Shelley McIntyre"
  },
  {
    phoneNumber: "+18102411276",
    callType: "OUTGOING",
    callDate: "1532991045879",
    callDuration: "440",
    callDayTime: "Mon Jul 30 15:50:45 PDT 2018",
    cachedName: "Gayle Serbus"
  },
  {
    phoneNumber: "+14256873583",
    callType: "INCOMING",
    callDate: "1532986775281",
    callDuration: "107",
    callDayTime: "Mon Jul 30 14:39:35 PDT 2018"
  },
  {
    phoneNumber: "+14159960080",
    callType: "INCOMING",
    callDate: "1532839297182",
    callDuration: "26",
    callDayTime: "Sat Jul 28 21:41:37 PDT 2018"
  },
  {
    phoneNumber: "+14159960080",
    callType: "OUTGOING",
    callDate: "1532839291652",
    callDuration: "37",
    callDayTime: "Sat Jul 28 21:41:31 PDT 2018"
  },
  {
    phoneNumber: "+12062954055",
    callType: "INCOMING",
    callDate: "1532804544212",
    callDuration: "7",
    callDayTime: "Sat Jul 28 12:02:24 PDT 2018",
    cachedName: "Shelley McIntyre"
  },
  {
    phoneNumber: "+12062954055",
    callType: "OUTGOING",
    callDate: "1532736219293",
    callDuration: "9",
    callDayTime: "Fri Jul 27 17:03:39 PDT 2018",
    cachedName: "Shelley McIntyre"
  },
  {
    phoneNumber: "+12062954055",
    callType: "INCOMING",
    callDate: "1532733590035",
    callDuration: "22",
    callDayTime: "Fri Jul 27 16:19:50 PDT 2018",
    cachedName: "Shelley McIntyre"
  },
  {
    phoneNumber: "+12062954055",
    callType: "OUTGOING",
    callDate: "1532733560323",
    callDuration: "2",
    callDayTime: "Fri Jul 27 16:19:20 PDT 2018",
    cachedName: "Shelley McIntyre"
  },
  {
    phoneNumber: "+12062954055",
    callType: "MISSED",
    callDate: "1532732043421",
    callDuration: "0",
    callDayTime: "Fri Jul 27 15:54:03 PDT 2018",
    cachedName: "Shelley McIntyre"
  },
  {
    phoneNumber: "+18108450861",
    callType: "INCOMING",
    callDate: "1532622539526",
    callDuration: "1894",
    callDayTime: "Thu Jul 26 09:28:59 PDT 2018",
    cachedName: "Jason Krupp"
  },
  {
    phoneNumber: "+18108450861",
    callType: "INCOMING",
    callDate: "1532622505291",
    callDuration: "18",
    callDayTime: "Thu Jul 26 09:28:25 PDT 2018",
    cachedName: "Jason Krupp"
  },
  {
    phoneNumber: "2066843000",
    callType: "OUTGOING",
    callDate: "1532562501360",
    callDuration: "417",
    callDayTime: "Wed Jul 25 16:48:21 PDT 2018"
  },
  {
    phoneNumber: "+18452070972",
    callType: "MISSED",
    callDate: "1532543673487",
    callDuration: "0",
    callDayTime: "Wed Jul 25 11:34:33 PDT 2018"
  },
  {
    phoneNumber: "+12533970609",
    callType: "INCOMING",
    callDate: "1532535194517",
    callDuration: "45",
    callDayTime: "Wed Jul 25 09:13:14 PDT 2018"
  },
  {
    phoneNumber: "+12533970609",
    callType: "INCOMING",
    callDate: "1532535109346",
    callDuration: "67",
    callDayTime: "Wed Jul 25 09:11:49 PDT 2018"
  },
  {
    phoneNumber: "+14257899597",
    callDate: "1532473459986",
    callDuration: "0",
    callDayTime: "Tue Jul 24 16:04:19 PDT 2018"
  },
  {
    phoneNumber: "+15163038249",
    callType: "OUTGOING",
    callDate: "1532463465461",
    callDuration: "181",
    callDayTime: "Tue Jul 24 13:17:45 PDT 2018"
  },
  {
    phoneNumber: "+15163038249",
    callType: "OUTGOING",
    callDate: "1532463454541",
    callDuration: "0",
    callDayTime: "Tue Jul 24 13:17:34 PDT 2018"
  },
  {
    phoneNumber: "+15163038249",
    callDate: "1532463332643",
    callDuration: "0",
    callDayTime: "Tue Jul 24 13:15:32 PDT 2018"
  },
  {
    phoneNumber: "2067261717",
    callType: "OUTGOING",
    callDate: "1532399086879",
    callDuration: "50",
    callDayTime: "Mon Jul 23 19:24:46 PDT 2018",
    cachedName: "Pagliacci"
  },
  {
    phoneNumber: "+14255029528",
    callType: "INCOMING",
    callDate: "1532359889067",
    callDuration: "164",
    callDayTime: "Mon Jul 23 08:31:29 PDT 2018"
  },
  {
    phoneNumber: "+18056721652",
    callType: "MISSED",
    callDate: "1532356261572",
    callDuration: "0",
    callDayTime: "Mon Jul 23 07:31:01 PDT 2018"
  },
  {
    phoneNumber: "+12064506878",
    callType: "OUTGOING",
    callDate: "1532275990233",
    callDuration: "537",
    callDayTime: "Sun Jul 22 09:13:10 PDT 2018",
    cachedName: "Brian Bennink"
  },
  {
    phoneNumber: "+12403194845",
    callType: "OUTGOING",
    callDate: "1532201326141",
    callDuration: "2",
    callDayTime: "Sat Jul 21 12:28:46 PDT 2018"
  },
  {
    phoneNumber: "+12403194845",
    callDate: "1532197748716",
    callDuration: "0",
    callDayTime: "Sat Jul 21 11:29:08 PDT 2018"
  },
  {
    phoneNumber: "+12067848101",
    callType: "MISSED",
    callDate: "1532137643332",
    callDuration: "0",
    callDayTime: "Fri Jul 20 18:47:23 PDT 2018"
  },
  {
    phoneNumber: "+18102411535",
    callType: "INCOMING",
    callDate: "1532133576878",
    callDuration: "1786",
    callDayTime: "Fri Jul 20 17:39:36 PDT 2018",
    cachedName: "Joseph Serbus (ICE-father)"
  },
  {
    phoneNumber: "4256796056",
    callType: "OUTGOING",
    callDate: "1532127375189",
    callDuration: "94",
    callDayTime: "Fri Jul 20 15:56:15 PDT 2018"
  },
  {
    phoneNumber: "4256796056",
    callType: "OUTGOING",
    callDate: "1532041345349",
    callDuration: "45",
    callDayTime: "Thu Jul 19 16:02:25 PDT 2018"
  },
  {
    phoneNumber: "2065225646",
    callType: "OUTGOING",
    callDate: "1532041094821",
    callDuration: "133",
    callDayTime: "Thu Jul 19 15:58:14 PDT 2018",
    cachedName: "David Deichert"
  }
];

interface Props {}

interface State {
  personTableData: Person[];
  addPerson: boolean;
  userInput: boolean;
  text: Object[];
  index: number;
}

export class HomeScreen extends Component<Props, State> {
  componentDidMount() {
    BackgroundTask.schedule();

    AsyncStorage.getItem("data").then((data) => {
      const jsonData = data ? JSON.parse(data) : defaultData;

      this.setState({ personTableData: jsonData });

      return getLog().then(callLog => {
          checkCallLog(jsonData, fakeCallLog)
        });
    });

    //checkPeople(defaultData);
  }

  constructor(props: Props) {
    super(props);

    this.state = {
      personTableData: [],
      addPerson: false,
      userInput: false,
      text: defaultText,
      index: 0
    };
  }

  static navigationOptions = {
    title: "Call Your Mom!"
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
        onValueChange={(itemValue, itemIndex) =>
          this.setState(prevState => {
            prevState.text[prevState.index] = itemValue;
            return prevState;
          })
        }
      >
        <Picker.Item label="Twice A Week" value={Frequency.twice_A_Week} />
        <Picker.Item label="Once A Week" value={Frequency.once_A_Week} />
        <Picker.Item
          label="Once Every Two Weeks"
          value={Frequency.once_Every_Two_Weeks}
        />
        <Picker.Item
          label="Once Every Three Weeks"
          value={Frequency.once_Every_Three_Weeks}
        />
        <Picker.Item
          label="Once Every Four Weeks"
          value={Frequency.once_Every_Four_Weeks}
        />
      </Picker>
    );

    if (this.state.addPerson) {
      addTable = (
        <Table borderStyle={{ borderColor: "transparent" }}>
          <Row
            data={addPersonHeader}
            style={addPersonStyles.head}
            textStyle={addPersonStyles.text}
          />
          {[this.state.text].map((rowData, index) => (
            <TableWrapper key={index} style={addPersonStyles.row}>
              {rowData.map((cellData, cellIndex) => (
                <Cell
                  key={cellIndex}
                  data={
                    cellIndex !== 5 ? button(cellData, cellIndex) : cellData
                  }
                  textStyle={styles.text}
                />
              ))}
            </TableWrapper>
          ))}
        </Table>
      );

      doneButton = <Button title="Done" onPress={this._done} />;
    }

    if (this.state.userInput) {
      if (this.state.index === 2) {
        changeText = picker();
      } else {
        changeText = (
          <TextInput
            style={{ height: 40 }}
            onChangeText={text =>
              this.setState(prevState => {
                prevState.text[prevState.index] = text;

                return prevState;
              })
            }
            value={this.state.text[this.state.index]}
          />
        );
      }

      confirmButton = (
        <Button title="Confirm" onPress={index => this._confirm()} />
      );
    }

    let displayPersonTableData = this.state.personTableData.map(person => {
      for (let i = 0; i < fakeCallLog.length; i++) {
        if (fakeCallLog[i].phoneNumber === person.phoneNumber) {
          const cdt = fakeCallLog[i].callDayTime;
          const daysRemaining = daysLeft(person, cdt);
          return this._getDisplayPersonTableRow(person, daysRemaining);
        }
      }

      return this._getDisplayPersonTableRow(person, 0);
    });

    // console.log(JSON.stringify(displayPersonTableData));

    return (
      <ScrollView style={styles.container}>
        <Table borderStyle={{ borderWidth: 2, borderColor: "#c8e1ff" }}>
          <Row
            data={personListHeader}
            style={styles.head}
            textStyle={styles.text}
          />
          <Rows data={displayPersonTableData} textStyle={styles.text} />
        </Table>

        <Button title="Add" onPress={this._addPersonCheck} />
        <Button title="Show me more of the app" onPress={this._showMoreApp} />
        <Button title="Actually, sign me out :)" onPress={this._signOutAsync} />

        {addTable}
        {changeText}
        {confirmButton}
        {doneButton}
      </ScrollView>
    );
  }

  _getDisplayPersonTableRow = (person, daysRemaining) => {
    return [person.name, daysRemaining, person.frequency, <Button title="Delete" onPress={ () => this._deletePersonCheck(person) } />];
  }

  _alertIndex = (index: number): void => {
    Alert.alert(`This is col ${index + 1}`);
  };

  _userInput = (index: number): void => {
    if (!this.state.userInput) {
      this.setState({
        userInput: true
      });
    }
    this.setState({
      index: index
    });
  };

  _done = (): void => {
    this.setState({
      userInput: false,
      addPerson: false
    });

    AsyncStorage.setItem("data", JSON.stringify(this.state.personTableData));
  };

  _confirm = (): void => {
    const newPerson = {
      name: this.state.text[0],
      phoneNumber: this.state.text[1],
      lastCall: new Date(this.state.text[2]),
      frequency: Frequency.once_A_Week
    };

    let newPTD = this.state.personTableData;
    newPTD.push(newPerson);

    this.setState({
      personTableData: newPTD,
      userInput: false,
      text: defaultText
    });
  };

  _addPersonCheck = () => {
    if (!this.state.addPerson) {
      this.setState({
        addPerson: true
      });
    } else {
      this.setState({
        addPerson: false
      });
    }
  };

  _deletePersonCheck = (person) => {
    this.setState(prevState => ({
      personTableData: this.state.personTableData.filter(p => p.name != person.name),
    }), () => this._done());
  };

  _showMoreApp = () => {
    this.props.navigation.navigate("Details");
  };

  _signOutAsync = async () => {
    LoginManager.logOut();

    await AsyncStorage.clear();

    this.props.navigation.navigate("Auth");
  };
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, paddingTop: 30, backgroundColor: "#fff" },
  head: { height: 40, backgroundColor: "#f1f8ff" },
  text: { margin: 6, textAlign: "center" },
  btn: { width: 58, height: 18, backgroundColor: "#78B7BB", borderRadius: 2 },
  btnText: { textAlign: "center", color: "#fff" }
});

const addPersonStyles = StyleSheet.create({
  container: { flex: 1, padding: 16, paddingTop: 30, backgroundColor: "#fff" },
  head: { height: 40, backgroundColor: "orange" },
  text: { margin: 6, textAlign: "center", color: "black" },
  row: { flexDirection: "row", backgroundColor: "#FFF1C1" },
  btn: { width: 58, height: 40, backgroundColor: "#78B7BB", borderRadius: 2 },
  btnText: { textAlign: "center", color: "#fff" }
});
