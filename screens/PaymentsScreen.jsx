import React, { useState, useMemo } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity,
  TextInput, Alert, SafeAreaView, Share, Modal, ScrollView,
} from 'react-native';

const DUMMY_SUBSCRIPTIONS = [
  { id:'1', studentId:'STU001', studentName:'Aarav Sharma', parentName:'Rajesh Sharma', parentEmail:'rajesh@email.com', parentPhone:'+91 98765 40001', plan:'Yearly', amount:12000, startDate: Date.now()-30*86400000, endDate: Date.now()+335*86400000, status:'ACTIVE', paymentStatus:'PAID' },
  { id:'2', studentId:'STU002', studentName:'Ishita Patel', parentName:'Meera Patel', parentEmail:'meera@email.com', parentPhone:'+91 98765 40002', plan:'Quarterly', amount:3500, startDate: Date.now()-15*86400000, endDate: Date.now()+75*86400000, status:'ACTIVE', paymentStatus:'PENDING' },
  { id:'3', studentId:'STU003', studentName:'Rohan Verma', parentName:'Anjali Verma', parentEmail:'anjali@email.com', parentPhone:'+91 98765 40003', plan:'Monthly', amount:1200, startDate: Date.now()-5*86400000, endDate: Date.now()+25*86400000, status:'ACTIVE', paymentStatus:'PAID' },
  { id:'4', studentId:'STU004', studentName:'Sanya Gupta', parentName:'Vikram Gupta', parentEmail:'vikram@email.com', parentPhone:'+91 98765 40004', plan:'Yearly', amount:12000, startDate: Date.now()-60*86400000, endDate: Date.now()+305*86400000, status:'ACTIVE', paymentStatus:'PAID' },
  { id:'5', studentId:'STU005', studentName:'Aditya Nair', parentName:'Sunil Nair', parentEmail:'sunil@email.com', parentPhone:'+91 98765 40005', plan:'Monthly', amount:1200, startDate: Date.now()-10*86400000, endDate: Date.now()+20*86400000, status:'ACTIVE', paymentStatus:'PENDING' },
  { id:'6', studentId:'STU006', studentName:'Kavya Singh', parentName:'Ritu Singh', parentEmail:'ritu@email.com', parentPhone:'+91 98765 40006', plan:'Quarterly', amount:3500, startDate: Date.now()-45*86400000, endDate: Date.now()+45*86400000, status:'ACTIVE', paymentStatus:'PAID' },
  { id:'7', studentId:'STU007', studentName:'Dhruv Kapoor', parentName:'Neha Kapoor', parentEmail:'neha@email.com', parentPhone:'+91 98765 40007', plan:'Monthly', amount:1200, startDate: Date.now()-2*86400000, endDate: Date.now()+28*86400000, status:'ACTIVE', paymentStatus:'PENDING' },
  { id:'8', studentId:'STU008', studentName:'Ananya Reddy', parentName:'Krishna Reddy', parentEmail:'krishna@email.com', parentPhone:'+91 98765 40008', plan:'Yearly', amount:12000, startDate: Date.now()-90*86400000, endDate: Date.now()+275*86400000, status:'ACTIVE', paymentStatus:'PAID' },
  { id:'9', studentId:'STU009', studentName:'Vihaan Joshi', parentName:'Pooja Joshi', parentEmail:'pooja@email.com', parentPhone:'+91 98765 40009', plan:'Monthly', amount:1200, startDate: Date.now()-1*86400000, endDate: Date.now()+29*86400000, status:'ACTIVE', paymentStatus:'PENDING' },
  { id:'10', studentId:'STU010', studentName:'Myra Malhotra', parentName:'Rahul Malhotra', parentEmail:'rahul@email.com', parentPhone:'+91 98765 40010', plan:'Quarterly', amount:3500, startDate: Date.now()-20*86400000, endDate: Date.now()+70*86400000, status:'ACTIVE', paymentStatus:'PAID' },
];

const DUMMY_TRANSACTIONS = [
  { id:'1', transactionId:'TXN20240001', studentName:'Aarav Sharma', parentName:'Rajesh Sharma', amount:12000, paymentMethod:'UPI', status:'SUCCESS', timestamp: Date.now()-30*86400000 },
  { id:'2', transactionId:'TXN20240002', studentName:'Sanya Gupta', parentName:'Vikram Gupta', amount:12000, paymentMethod:'NET BANKING', status:'SUCCESS', timestamp: Date.now()-60*86400000 },
  { id:'3', transactionId:'TXN20240003', studentName:'Ananya Reddy', parentName:'Krishna Reddy', amount:12000, paymentMethod:'CARD', status:'SUCCESS', timestamp: Date.now()-90*86400000 },
  { id:'4', transactionId:'TXN20240004', studentName:'Kavya Singh', parentName:'Ritu Singh', amount:3500, paymentMethod:'UPI', status:'SUCCESS', timestamp: Date.now()-45*86400000 },
  { id:'5', transactionId:'TXN20240005', studentName:'Rohan Verma', parentName:'Anjali Verma', amount:1200, paymentMethod:'CASH', status:'SUCCESS', timestamp: Date.now()-5*86400000 },
  { id:'6', transactionId:'TXN20240006', studentName:'Myra Malhotra', parentName:'Rahul Malhotra', amount:3500, paymentMethod:'UPI', status:'SUCCESS', timestamp: Date.now()-20*86400000 },
  { id:'7', transactionId:'TXN20240007', studentName:'Aarav Sharma', parentName:'Rajesh Sharma', amount:12000, paymentMethod:'UPI', status:'SUCCESS', timestamp: Date.now()-395*86400000 },
  { id:'8', transactionId:'TXN20240008', studentName:'Sanya Gupta', parentName:'Vikram Gupta', amount:12000, paymentMethod:'NET BANKING', status:'SUCCESS', timestamp: Date.now()-425*86400000 },
  { id:'9', transactionId:'TXN20240009', studentName:'Ananya Reddy', parentName:'Krishna Reddy', amount:12000, paymentMethod:'CARD', status:'SUCCESS', timestamp: Date.now()-455*86400000 },
  { id:'10', transactionId:'TXN20240010', studentName:'Kavya Singh', parentName:'Ritu Singh', amount:3500, paymentMethod:'CASH', status:'SUCCESS', timestamp: Date.now()-135*86400000 },
];

const formatDate = (ts) => new Date(ts).toLocaleDateString('en-IN', { day:'2-digit', month:'short', year:'numeric' });
const formatDateTime = (ts) => new Date(ts).toLocaleString('en-IN', { day:'2-digit', month:'short', year:'numeric', hour:'2-digit', minute:'2-digit' });
const formatAmount = (n) => `₹${n.toLocaleString('en-IN')}`;
const initials = (name) => name.split(' ').slice(0,2).map(w => w[0].toUpperCase()).join('');

export default function PaymentsScreen({ navigation }) {
  const [subscriptions, setSubscriptions] = useState(DUMMY_SUBSCRIPTIONS);
  const [transactions, setTransactions] = useState(DUMMY_TRANSACTIONS);
  const [tab, setTab] = useState('SUBSCRIPTIONS');
  const [search, setSearch] = useState('');
  const [detailSub, setDetailSub] = useState(null);
  const [detailTxn, setDetailTxn] = useState(null);
  const [recordModal, setRecordModal] = useState(null);
  const [recordAmount, setRecordAmount] = useState('');
  const [recordMethod, setRecordMethod] = useState('');

  const totalRevenue = transactions.reduce((s, t) => s + t.amount, 0);
  const activeSubs = subscriptions.filter(s => s.status === 'ACTIVE' && s.paymentStatus === 'PAID').length;
  const pending = subscriptions.filter(s => s.paymentStatus === 'PENDING').length;

  const filteredSubs = useMemo(() => {
    const q = search.toLowerCase();
    return subscriptions.filter(s => !q || s.studentName.toLowerCase().includes(q) || s.parentName.toLowerCase().includes(q));
  }, [subscriptions, search]);

  const filteredTxns = useMemo(() => {
    const q = search.toLowerCase();
    return transactions.filter(t => !q || t.studentName.toLowerCase().includes(q) || t.transactionId.toLowerCase().includes(q));
  }, [transactions, search]);

  const markAsPaid = (sub) => {
    Alert.alert('Confirm Payment', `Mark payment as received for ${sub.studentName}?`, [
      { text: 'Yes', onPress: () => {
        setSubscriptions(prev => prev.map(s => s.id === sub.id ? { ...s, paymentStatus:'PAID' } : s));
        Alert.alert('', 'Payment marked as PAID');
      }},
      { text: 'No', style:'cancel' },
    ]);
  };

  const sendReminder = (sub) => {
    Alert.alert('Send Reminder', `Send payment reminder to ${sub.parentName} for ${formatAmount(sub.amount)}?`, [
      { text: 'Send', onPress: () => Alert.alert('', `Reminder sent to ${sub.parentEmail}`) },
      { text: 'Cancel', style:'cancel' },
    ]);
  };

  const recordPayment = () => {
    if (!recordAmount.trim()) { Alert.alert('', 'Enter amount'); return; }
    const method = recordMethod.trim() || 'CASH';
    setSubscriptions(prev => prev.map(s => s.id === recordModal.id ? { ...s, paymentStatus:'PAID' } : s));
    const newTxn = {
      id: String(transactions.length + 1),
      transactionId: `TXN${Date.now()}`,
      studentName: recordModal.studentName,
      parentName: recordModal.parentName,
      amount: parseFloat(recordAmount) || recordModal.amount,
      paymentMethod: method.toUpperCase(),
      status: 'SUCCESS',
      timestamp: Date.now(),
    };
    setTransactions(prev => [newTxn, ...prev]);
    Alert.alert('', `Payment recorded for ${recordModal.studentName}!`);
    setRecordModal(null); setRecordAmount(''); setRecordMethod('');
  };

  const exportData = async () => {
    const sb = 'SCHUBER PAYMENT REPORT\n' + '='.repeat(50) + '\n\n';
    const body = tab === 'SUBSCRIPTIONS'
      ? filteredSubs.map(s => `${s.studentName} | ${s.plan} | ${formatAmount(s.amount)} | ${s.paymentStatus}`).join('\n')
      : filteredTxns.map(t => `${t.transactionId} | ${t.studentName} | ${formatAmount(t.amount)} | ${t.paymentMethod}`).join('\n');
    await Share.share({ message: sb + body });
  };

  const payColor = (p) => p === 'PAID' ? '#10b981' : '#f59e0b';
  const methodIcon = (m) => ({ 'UPI':'📱', 'CARD':'💳', 'NET BANKING':'🏦', 'CASH':'💵' }[m] || '💰');

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backText}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Payments</Text>
        <TouchableOpacity onPress={exportData}>
          <Text style={styles.exportBtn}>Export</Text>
        </TouchableOpacity>
      </View>

      {/* Stats */}
      <View style={styles.statsRow}>
        <View style={styles.statBox}>
          <Text style={[styles.statVal, { color:'#10b981', fontSize:16 }]}>{formatAmount(totalRevenue)}</Text>
          <Text style={styles.statLbl}>Total Revenue</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={[styles.statVal, { color:'#3b82f6' }]}>{activeSubs}</Text>
          <Text style={styles.statLbl}>Active Paid</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={[styles.statVal, { color:'#f59e0b' }]}>{pending}</Text>
          <Text style={styles.statLbl}>Pending</Text>
        </View>
      </View>

      {/* Search */}
      <View style={styles.searchWrap}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search student, parent, transaction..."
          placeholderTextColor="#64748b"
          value={search}
          onChangeText={setSearch}
        />
      </View>

      {/* Tabs */}
      <View style={styles.tabs}>
        <TouchableOpacity style={[styles.tab, tab === 'SUBSCRIPTIONS' && styles.tabActiveSub]} onPress={() => setTab('SUBSCRIPTIONS')}>
          <Text style={[styles.tabText, tab === 'SUBSCRIPTIONS' && styles.tabTextActive]}>💳 Subscriptions</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.tab, tab === 'TRANSACTIONS' && styles.tabActiveTxn]} onPress={() => setTab('TRANSACTIONS')}>
          <Text style={[styles.tabText, tab === 'TRANSACTIONS' && styles.tabTextActive]}>📜 Transactions</Text>
        </TouchableOpacity>
      </View>

      {/* List */}
      {tab === 'SUBSCRIPTIONS' ? (
        <FlatList
          data={filteredSubs}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.list}
          ListEmptyComponent={<Empty icon="💳" text="No subscriptions found" />}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <View style={[styles.avatar, { backgroundColor: payColor(item.paymentStatus) }]}>
                  <Text style={styles.avatarText}>{initials(item.studentName)}</Text>
                </View>
                <View style={styles.cardInfo}>
                  <Text style={styles.cardName}>{item.studentName}</Text>
                  <Text style={styles.cardSub}>Parent: {item.parentName}</Text>
                </View>
                <View style={[styles.statusBadge, { backgroundColor: payColor(item.paymentStatus) + '22', borderColor: payColor(item.paymentStatus) }]}>
                  <Text style={[styles.statusText, { color: payColor(item.paymentStatus) }]}>{item.paymentStatus}</Text>
                </View>
              </View>
              <View style={styles.detailsGrid}>
                <Detail label="Plan" value={item.plan} />
                <Detail label="Amount" value={formatAmount(item.amount)} />
                <Detail label="Valid Until" value={formatDate(item.endDate)} />
                <Detail label="Status" value={item.status} />
              </View>
              <View style={styles.actions}>
                <TouchableOpacity style={styles.btnView} onPress={() => setDetailSub(item)}>
                  <Text style={styles.btnViewText}>👁 Details</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.btnRecord} onPress={() => { setRecordModal(item); setRecordAmount(String(item.amount)); setRecordMethod(''); }}>
                  <Text style={styles.btnRecordText}>💰 Record</Text>
                </TouchableOpacity>
                {item.paymentStatus === 'PENDING' && (
                  <>
                    <TouchableOpacity style={styles.btnPaid} onPress={() => markAsPaid(item)}>
                      <Text style={styles.btnPaidText}>✅ Mark Paid</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.btnRemind} onPress={() => sendReminder(item)}>
                      <Text style={styles.btnRemindText}>🔔 Remind</Text>
                    </TouchableOpacity>
                  </>
                )}
              </View>
            </View>
          )}
        />
      ) : (
        <FlatList
          data={filteredTxns}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.list}
          ListEmptyComponent={<Empty icon="📜" text="No transactions found" />}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.txnCard} onPress={() => setDetailTxn(item)} activeOpacity={0.8}>
              <View style={styles.txnLeft}>
                <Text style={styles.txnIcon}>{methodIcon(item.paymentMethod)}</Text>
                <View>
                  <Text style={styles.txnId}>{item.transactionId}</Text>
                  <Text style={styles.txnName}>{item.studentName} — {item.parentName}</Text>
                  <Text style={styles.txnDate}>{formatDate(item.timestamp)} · {item.paymentMethod}</Text>
                </View>
              </View>
              <View style={styles.txnRight}>
                <Text style={styles.txnAmount}>{formatAmount(item.amount)}</Text>
                <Text style={[styles.txnStatus, { color: item.status === 'SUCCESS' ? '#10b981' : '#f59e0b' }]}>{item.status}</Text>
              </View>
            </TouchableOpacity>
          )}
        />
      )}

      {/* Subscription Detail Modal */}
      <Modal visible={!!detailSub} animationType="slide" transparent onRequestClose={() => setDetailSub(null)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Subscription Details</Text>
            {detailSub && (
              <ScrollView>
                <ModalRow label="Student" value={detailSub.studentName} />
                <ModalRow label="Parent" value={detailSub.parentName} />
                <ModalRow label="Phone" value={detailSub.parentPhone} />
                <ModalRow label="Email" value={detailSub.parentEmail} />
                <ModalRow label="Plan" value={detailSub.plan} />
                <ModalRow label="Amount" value={formatAmount(detailSub.amount)} />
                <ModalRow label="Start" value={formatDate(detailSub.startDate)} />
                <ModalRow label="End" value={formatDate(detailSub.endDate)} />
                <ModalRow label="Status" value={detailSub.status} />
                <ModalRow label="Payment" value={detailSub.paymentStatus} />
              </ScrollView>
            )}
            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.btnRecord} onPress={() => { setRecordModal(detailSub); setRecordAmount(String(detailSub?.amount)); setRecordMethod(''); setDetailSub(null); }}>
                <Text style={styles.btnRecordText}>💰 Record Payment</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.btnView} onPress={() => setDetailSub(null)}>
                <Text style={styles.btnViewText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Transaction Detail Modal */}
      <Modal visible={!!detailTxn} animationType="slide" transparent onRequestClose={() => setDetailTxn(null)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Transaction Details</Text>
            {detailTxn && (
              <>
                <ModalRow label="Txn ID" value={detailTxn.transactionId} />
                <ModalRow label="Student" value={detailTxn.studentName} />
                <ModalRow label="Parent" value={detailTxn.parentName} />
                <ModalRow label="Amount" value={formatAmount(detailTxn.amount)} />
                <ModalRow label="Method" value={detailTxn.paymentMethod} />
                <ModalRow label="Date" value={formatDateTime(detailTxn.timestamp)} />
                <ModalRow label="Status" value={detailTxn.status} />
              </>
            )}
            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.btnView} onPress={() => setDetailTxn(null)}>
                <Text style={styles.btnViewText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Record Payment Modal */}
      <Modal visible={!!recordModal} animationType="slide" transparent onRequestClose={() => setRecordModal(null)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Record Payment</Text>
            {recordModal && <Text style={styles.modalSubtitle}>{recordModal.studentName}</Text>}
            <Text style={styles.fieldLabel}>Amount (₹)</Text>
            <TextInput
              style={styles.fieldInput}
              placeholder="Enter amount"
              placeholderTextColor="#64748b"
              value={recordAmount}
              onChangeText={setRecordAmount}
              keyboardType="numeric"
            />
            <Text style={styles.fieldLabel}>Payment Method</Text>
            <TextInput
              style={styles.fieldInput}
              placeholder="UPI / CASH / CARD / NET BANKING"
              placeholderTextColor="#64748b"
              value={recordMethod}
              onChangeText={setRecordMethod}
              autoCapitalize="characters"
            />
            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.btnPaid} onPress={recordPayment}>
                <Text style={styles.btnPaidText}>Record</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.btnView} onPress={() => setRecordModal(null)}>
                <Text style={styles.btnViewText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

function Detail({ label, value }) {
  return (
    <View style={styles.detailItem}>
      <Text style={styles.detailLabel}>{label}</Text>
      <Text style={styles.detailValue}>{value}</Text>
    </View>
  );
}

function ModalRow({ label, value }) {
  return (
    <View style={styles.modalRow}>
      <Text style={styles.modalLabel}>{label}:</Text>
      <Text style={styles.modalValue}>{value}</Text>
    </View>
  );
}

function Empty({ icon, text }) {
  return (
    <View style={styles.emptyWrap}>
      <Text style={styles.emptyIcon}>{icon}</Text>
      <Text style={styles.emptyText}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex:1, backgroundColor:'#0f172a' },
  header: { flexDirection:'row', alignItems:'center', justifyContent:'space-between', padding:16, paddingTop:8 },
  backBtn: { padding:8 },
  backText: { color:'#f1f5f9', fontSize:32, lineHeight:36 },
  headerTitle: { color:'#f1f5f9', fontSize:18, fontWeight:'700' },
  exportBtn: { color:'#3b82f6', fontSize:14, fontWeight:'600' },
  statsRow: { flexDirection:'row', marginHorizontal:16, marginBottom:10, backgroundColor:'#1e293b', borderRadius:12, padding:12 },
  statBox: { flex:1, alignItems:'center' },
  statVal: { color:'#f1f5f9', fontSize:22, fontWeight:'800' },
  statLbl: { color:'#64748b', fontSize:11, marginTop:2 },
  searchWrap: { marginHorizontal:16, marginBottom:10 },
  searchInput: { backgroundColor:'#1e293b', borderRadius:10, paddingHorizontal:14, paddingVertical:10, color:'#f1f5f9', fontSize:14, borderWidth:1, borderColor:'#334155' },
  tabs: { flexDirection:'row', marginHorizontal:16, marginBottom:12, backgroundColor:'#1e293b', borderRadius:10, padding:4 },
  tab: { flex:1, paddingVertical:8, borderRadius:8, alignItems:'center' },
  tabActiveSub: { backgroundColor:'#f59e0b' },
  tabActiveTxn: { backgroundColor:'#10b981' },
  tabText: { color:'#64748b', fontWeight:'600', fontSize:13 },
  tabTextActive: { color:'#fff' },
  list: { paddingHorizontal:16, paddingBottom:30 },
  emptyWrap: { alignItems:'center', paddingTop:60 },
  emptyIcon: { fontSize:48, marginBottom:12 },
  emptyText: { color:'#475569', fontSize:16 },
  card: { backgroundColor:'#1e293b', borderRadius:14, padding:16, marginBottom:12 },
  cardHeader: { flexDirection:'row', alignItems:'center', marginBottom:12 },
  avatar: { width:44, height:44, borderRadius:22, justifyContent:'center', alignItems:'center', marginRight:12 },
  avatarText: { color:'#fff', fontWeight:'700', fontSize:14 },
  cardInfo: { flex:1 },
  cardName: { color:'#f1f5f9', fontSize:15, fontWeight:'700' },
  cardSub: { color:'#64748b', fontSize:12, marginTop:1 },
  statusBadge: { borderRadius:8, paddingHorizontal:8, paddingVertical:3, borderWidth:1 },
  statusText: { fontSize:11, fontWeight:'700' },
  detailsGrid: { flexDirection:'row', flexWrap:'wrap', marginBottom:12 },
  detailItem: { width:'50%', marginBottom:6 },
  detailLabel: { color:'#64748b', fontSize:11 },
  detailValue: { color:'#cbd5e1', fontSize:13, fontWeight:'500' },
  actions: { flexDirection:'row', flexWrap:'wrap', gap:8 },
  btnView: { backgroundColor:'#334155', borderRadius:8, paddingHorizontal:12, paddingVertical:7 },
  btnViewText: { color:'#f1f5f9', fontSize:12, fontWeight:'600' },
  btnRecord: { backgroundColor:'#1e40af33', borderRadius:8, paddingHorizontal:12, paddingVertical:7, borderWidth:1, borderColor:'#3b82f655' },
  btnRecordText: { color:'#3b82f6', fontSize:12, fontWeight:'600' },
  btnPaid: { backgroundColor:'#05966922', borderRadius:8, paddingHorizontal:12, paddingVertical:7, borderWidth:1, borderColor:'#10b98155' },
  btnPaidText: { color:'#10b981', fontSize:12, fontWeight:'600' },
  btnRemind: { backgroundColor:'#78350f33', borderRadius:8, paddingHorizontal:12, paddingVertical:7, borderWidth:1, borderColor:'#f59e0b55' },
  btnRemindText: { color:'#f59e0b', fontSize:12, fontWeight:'600' },
  txnCard: { backgroundColor:'#1e293b', borderRadius:12, padding:14, marginBottom:10, flexDirection:'row', alignItems:'center', justifyContent:'space-between' },
  txnLeft: { flexDirection:'row', alignItems:'center', flex:1 },
  txnIcon: { fontSize:28, marginRight:12 },
  txnId: { color:'#94a3b8', fontSize:11, fontWeight:'600' },
  txnName: { color:'#f1f5f9', fontSize:13, fontWeight:'600', marginTop:1 },
  txnDate: { color:'#64748b', fontSize:11, marginTop:1 },
  txnRight: { alignItems:'flex-end' },
  txnAmount: { color:'#10b981', fontSize:15, fontWeight:'800' },
  txnStatus: { fontSize:11, fontWeight:'700', marginTop:2 },
  modalOverlay: { flex:1, backgroundColor:'#000000aa', justifyContent:'center', alignItems:'center', padding:20 },
  modalBox: { backgroundColor:'#1e293b', borderRadius:16, padding:20, width:'100%', maxHeight:'85%' },
  modalTitle: { color:'#f1f5f9', fontSize:18, fontWeight:'700', marginBottom:4, textAlign:'center' },
  modalSubtitle: { color:'#64748b', fontSize:13, textAlign:'center', marginBottom:12 },
  modalRow: { flexDirection:'row', marginBottom:8 },
  modalLabel: { color:'#64748b', fontSize:13, width:80 },
  modalValue: { color:'#cbd5e1', fontSize:13, flex:1, fontWeight:'500' },
  modalActions: { flexDirection:'row', gap:10, marginTop:16, justifyContent:'flex-end', flexWrap:'wrap' },
  fieldLabel: { color:'#94a3b8', fontSize:12, fontWeight:'600', marginBottom:6, marginTop:12 },
  fieldInput: { backgroundColor:'#0f172a', borderWidth:1, borderColor:'#334155', borderRadius:10, padding:12, color:'#f1f5f9', fontSize:14 },
});
