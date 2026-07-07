import React, { useState, useMemo } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity,
  TextInput, Alert, Linking, SafeAreaView, Share, Modal, ScrollView,
} from 'react-native';

const DUMMY_STUDENTS = [
  { id:'1', studentId:'STU201', name:'Aarav Sharma', className:'Class 5-A', parentName:'Rajesh Sharma', parentPhone:'+91 98002 21001', parentEmail:'rajesh@email.com', pickupLocation:'Green Park Gate', dropLocation:'Green Park Colony', subscriptionPlan:'Yearly', paymentStatus:'PAID', status:'PENDING', registrationDate: Date.now()-4*86400000, assignedDriverName:null },
  { id:'2', studentId:'STU202', name:'Ishita Patel', className:'Class 8-B', parentName:'Meera Patel', parentPhone:'+91 98002 21002', parentEmail:'meera@email.com', pickupLocation:'Sector 15 Market', dropLocation:'Sector 15 Block C', subscriptionPlan:'Quarterly', paymentStatus:'PENDING', status:'PENDING', registrationDate: Date.now()-2*86400000, assignedDriverName:null },
  { id:'3', studentId:'STU203', name:'Rohan Verma', className:'Class 3-C', parentName:'Anjali Verma', parentPhone:'+91 98002 21003', parentEmail:'anjali@email.com', pickupLocation:'Lake View Apts', dropLocation:'Lake View Apts', subscriptionPlan:'Monthly', paymentStatus:'PAID', status:'APPROVED', registrationDate: Date.now()-30*86400000, assignedDriverName:'Rajesh Kumar' },
  { id:'4', studentId:'STU204', name:'Sanya Gupta', className:'Class 10-A', parentName:'Vikram Gupta', parentPhone:'+91 98002 21004', parentEmail:'vikram@email.com', pickupLocation:'City Center Mall', dropLocation:'City Heights', subscriptionPlan:'Yearly', paymentStatus:'PAID', status:'APPROVED', registrationDate: Date.now()-45*86400000, assignedDriverName:'Suresh Reddy' },
  { id:'5', studentId:'STU205', name:'Aditya Nair', className:'Class 7-B', parentName:'Sunil Nair', parentPhone:'+91 98002 21005', parentEmail:'sunil@email.com', pickupLocation:'Railway Station Rd', dropLocation:'Railway Quarters', subscriptionPlan:'Monthly', paymentStatus:'PENDING', status:'PENDING', registrationDate: Date.now()-1*86400000, assignedDriverName:null },
  { id:'6', studentId:'STU206', name:'Kavya Singh', className:'Class 9-C', parentName:'Ritu Singh', parentPhone:'+91 98002 21006', parentEmail:'ritu@email.com', pickupLocation:'Rose Garden Colony', dropLocation:'Rose Garden Colony', subscriptionPlan:'Quarterly', paymentStatus:'PAID', status:'APPROVED', registrationDate: Date.now()-60*86400000, assignedDriverName:'Prakash Rao' },
];

export default function StudentApprovalScreen({ navigation }) {
  const [students, setStudents] = useState(DUMMY_STUDENTS);
  const [search, setSearch] = useState('');
  const [tab, setTab] = useState('PENDING');
  const [detailStudent, setDetailStudent] = useState(null);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return students.filter(s =>
      s.status === tab &&
      (!q || s.name.toLowerCase().includes(q) ||
       s.className.toLowerCase().includes(q) ||
       s.parentName.toLowerCase().includes(q))
    );
  }, [students, search, tab]);

  const total = students.length;
  const pending = students.filter(s => s.status === 'PENDING').length;
  const approved = students.filter(s => s.status === 'APPROVED').length;

  const updateStatus = (id, status) => {
    setStudents(prev => prev.map(s => s.id === id ? { ...s, status } : s));
  };

  const showApproveDialog = (student) => {
    Alert.alert(
      'Approve Student',
      `Approve ${student.name}'s registration?\n\nClass: ${student.className}\nParent: ${student.parentName}\nPlan: ${student.subscriptionPlan}`,
      [
        { text: 'Approve', onPress: () => { updateStatus(student.id, 'APPROVED'); Alert.alert('', `${student.name} approved!`); } },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  const showRejectDialog = (student) => {
    Alert.alert(
      'Reject Student',
      `Are you sure you want to reject ${student.name}?`,
      [
        { text: 'Reject', style: 'destructive', onPress: () => updateStatus(student.id, 'REJECTED') },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  const contactParent = (student) => {
    Alert.alert(`Contact ${student.parentName}`, '', [
      { text: '📞 Call', onPress: () => Linking.openURL(`tel:${student.parentPhone}`) },
      { text: '📧 Email', onPress: () => Linking.openURL(`mailto:${student.parentEmail}?subject=Regarding ${student.name}`) },
      { text: 'Cancel', style: 'cancel' },
    ]);
  };

  const exportReport = async () => {
    if (filtered.length === 0) { Alert.alert('', 'No data to export'); return; }
    const text = 'SCHUBER STUDENT APPROVAL REPORT\n' + '='.repeat(50) + '\n\n' +
      filtered.map(s => `${s.name} | ${s.className} | ${s.parentName} | ${s.status}`).join('\n');
    await Share.share({ message: text });
  };

  const formatDate = (ts) => new Date(ts).toLocaleDateString('en-IN', { day:'2-digit', month:'short', year:'numeric' });
  const initials = (name) => name.split(' ').slice(0,2).map(w => w[0].toUpperCase()).join('');
  const statusColor = (s) => s === 'APPROVED' ? '#10b981' : s === 'PENDING' ? '#f59e0b' : '#ef4444';
  const payColor = (p) => p === 'PAID' ? '#10b981' : '#f59e0b';

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backText}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Student Approval</Text>
        <TouchableOpacity onPress={exportReport}>
          <Text style={styles.exportBtn}>Export</Text>
        </TouchableOpacity>
      </View>

      {/* Stats */}
      <View style={styles.statsRow}>
        <View style={styles.statBox}>
          <Text style={styles.statVal}>{total}</Text>
          <Text style={styles.statLbl}>Total</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={[styles.statVal, { color:'#f59e0b' }]}>{pending}</Text>
          <Text style={styles.statLbl}>Pending</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={[styles.statVal, { color:'#10b981' }]}>{approved}</Text>
          <Text style={styles.statLbl}>Approved</Text>
        </View>
      </View>

      {/* Pending Banner */}
      {pending > 0 && (
        <View style={styles.pendingBanner}>
          <Text style={styles.pendingBannerText}>⏳ {pending} Student{pending > 1 ? 's' : ''} Pending Approval</Text>
        </View>
      )}

      {/* Search */}
      <View style={styles.searchWrap}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search by name, class, parent..."
          placeholderTextColor="#64748b"
          value={search}
          onChangeText={setSearch}
        />
      </View>

      {/* Tabs */}
      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tab, tab === 'PENDING' && styles.tabActivePending]}
          onPress={() => setTab('PENDING')}
        >
          <Text style={[styles.tabText, tab === 'PENDING' && styles.tabTextActive]}>Pending</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, tab === 'APPROVED' && styles.tabActiveApproved]}
          onPress={() => setTab('APPROVED')}
        >
          <Text style={[styles.tabText, tab === 'APPROVED' && styles.tabTextActive]}>Approved</Text>
        </TouchableOpacity>
      </View>

      {/* List */}
      <FlatList
        data={filtered}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.emptyWrap}>
            <Text style={styles.emptyIcon}>🎓</Text>
            <Text style={styles.emptyText}>No {tab.toLowerCase()} students</Text>
          </View>
        }
        renderItem={({ item }) => (
          <View style={styles.card}>
            {/* Card Header */}
            <View style={styles.cardHeader}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>{initials(item.name)}</Text>
              </View>
              <View style={styles.cardInfo}>
                <Text style={styles.cardName}>{item.name}</Text>
                <Text style={styles.cardSub}>{item.className}</Text>
                <Text style={styles.cardSub}>ID: {item.studentId}</Text>
              </View>
              <View style={[styles.statusBadge, { backgroundColor: statusColor(item.status) + '22', borderColor: statusColor(item.status) }]}>
                <Text style={[styles.statusText, { color: statusColor(item.status) }]}>{item.status}</Text>
              </View>
            </View>

            {/* Details */}
            <View style={styles.detailsGrid}>
              <Detail label="Parent" value={item.parentName} />
              <Detail label="Phone" value={item.parentPhone} />
              <Detail label="Pickup" value={item.pickupLocation} />
              <Detail label="Drop" value={item.dropLocation} />
              <Detail label="Plan" value={item.subscriptionPlan} />
              <Detail label="Payment" value={item.paymentStatus} valueColor={payColor(item.paymentStatus)} />
              <Detail label="Driver" value={item.assignedDriverName || 'Not Assigned'} />
              <Detail label="Registered" value={formatDate(item.registrationDate)} />
            </View>

            {/* Actions */}
            <View style={styles.actions}>
              <TouchableOpacity style={styles.btnView} onPress={() => setDetailStudent(item)}>
                <Text style={styles.btnViewText}>👁 Details</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.btnContact} onPress={() => contactParent(item)}>
                <Text style={styles.btnContactText}>📞 Contact</Text>
              </TouchableOpacity>
              {item.status === 'PENDING' && (
                <>
                  <TouchableOpacity style={styles.btnApprove} onPress={() => showApproveDialog(item)}>
                    <Text style={styles.btnApproveText}>✅ Approve</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.btnReject} onPress={() => showRejectDialog(item)}>
                    <Text style={styles.btnRejectText}>✕ Reject</Text>
                  </TouchableOpacity>
                </>
              )}
            </View>
          </View>
        )}
      />

      {/* Detail Modal */}
      <Modal visible={!!detailStudent} animationType="slide" transparent onRequestClose={() => setDetailStudent(null)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <ScrollView>
              {detailStudent && (
                <>
                  <Text style={styles.modalTitle}>Student Details</Text>
                  <Text style={styles.modalSection}>📋 STUDENT INFORMATION</Text>
                  <ModalRow label="ID" value={detailStudent.studentId} />
                  <ModalRow label="Name" value={detailStudent.name} />
                  <ModalRow label="Class" value={detailStudent.className} />
                  <Text style={styles.modalSection}>👨‍👩‍👧 PARENT DETAILS</Text>
                  <ModalRow label="Name" value={detailStudent.parentName} />
                  <ModalRow label="Phone" value={detailStudent.parentPhone} />
                  <ModalRow label="Email" value={detailStudent.parentEmail} />
                  <Text style={styles.modalSection}>📍 LOCATIONS</Text>
                  <ModalRow label="Pickup" value={detailStudent.pickupLocation} />
                  <ModalRow label="Drop" value={detailStudent.dropLocation} />
                  <Text style={styles.modalSection}>💰 SUBSCRIPTION</Text>
                  <ModalRow label="Plan" value={detailStudent.subscriptionPlan} />
                  <ModalRow label="Payment" value={detailStudent.paymentStatus} />
                  <ModalRow label="Registered" value={formatDate(detailStudent.registrationDate)} />
                  <ModalRow label="Status" value={detailStudent.status} />
                </>
              )}
            </ScrollView>
            <View style={styles.modalActions}>
              {detailStudent && (
                <TouchableOpacity style={styles.btnContact} onPress={() => { contactParent(detailStudent); setDetailStudent(null); }}>
                  <Text style={styles.btnContactText}>📞 Contact Parent</Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity style={styles.btnView} onPress={() => setDetailStudent(null)}>
                <Text style={styles.btnViewText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

function Detail({ label, value, valueColor }) {
  return (
    <View style={styles.detailItem}>
      <Text style={styles.detailLabel}>{label}</Text>
      <Text style={[styles.detailValue, valueColor ? { color: valueColor, fontWeight:'700' } : null]}>{value}</Text>
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
  pendingBanner: { marginHorizontal:16, backgroundColor:'#f59e0b22', borderRadius:8, padding:10, marginBottom:8, borderWidth:1, borderColor:'#f59e0b55' },
  pendingBannerText: { color:'#f59e0b', fontSize:13, fontWeight:'600', textAlign:'center' },
  searchWrap: { marginHorizontal:16, marginBottom:10 },
  searchInput: { backgroundColor:'#1e293b', borderRadius:10, paddingHorizontal:14, paddingVertical:10, color:'#f1f5f9', fontSize:14, borderWidth:1, borderColor:'#334155' },
  tabs: { flexDirection:'row', marginHorizontal:16, marginBottom:12, backgroundColor:'#1e293b', borderRadius:10, padding:4 },
  tab: { flex:1, paddingVertical:8, borderRadius:8, alignItems:'center' },
  tabActivePending: { backgroundColor:'#f59e0b' },
  tabActiveApproved: { backgroundColor:'#10b981' },
  tabText: { color:'#64748b', fontWeight:'600', fontSize:14 },
  tabTextActive: { color:'#fff' },
  list: { paddingHorizontal:16, paddingBottom:30 },
  emptyWrap: { alignItems:'center', paddingTop:60 },
  emptyIcon: { fontSize:48, marginBottom:12 },
  emptyText: { color:'#475569', fontSize:16 },
  card: { backgroundColor:'#1e293b', borderRadius:14, padding:16, marginBottom:12 },
  cardHeader: { flexDirection:'row', alignItems:'center', marginBottom:12 },
  avatar: { width:44, height:44, borderRadius:22, backgroundColor:'#10b981', justifyContent:'center', alignItems:'center', marginRight:12 },
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
  btnContact: { backgroundColor:'#1e40af33', borderRadius:8, paddingHorizontal:12, paddingVertical:7, borderWidth:1, borderColor:'#3b82f655' },
  btnContactText: { color:'#3b82f6', fontSize:12, fontWeight:'600' },
  btnApprove: { backgroundColor:'#05966922', borderRadius:8, paddingHorizontal:12, paddingVertical:7, borderWidth:1, borderColor:'#10b98155' },
  btnApproveText: { color:'#10b981', fontSize:12, fontWeight:'600' },
  btnReject: { backgroundColor:'#ef444422', borderRadius:8, paddingHorizontal:12, paddingVertical:7, borderWidth:1, borderColor:'#ef444455' },
  btnRejectText: { color:'#ef4444', fontSize:12, fontWeight:'600' },
  modalOverlay: { flex:1, backgroundColor:'#000000aa', justifyContent:'center', alignItems:'center', padding:20 },
  modalBox: { backgroundColor:'#1e293b', borderRadius:16, padding:20, width:'100%', maxHeight:'80%' },
  modalTitle: { color:'#f1f5f9', fontSize:18, fontWeight:'700', marginBottom:16, textAlign:'center' },
  modalSection: { color:'#94a3b8', fontSize:12, fontWeight:'700', letterSpacing:1, marginTop:12, marginBottom:6 },
  modalRow: { flexDirection:'row', marginBottom:6 },
  modalLabel: { color:'#64748b', fontSize:13, width:100 },
  modalValue: { color:'#cbd5e1', fontSize:13, flex:1, fontWeight:'500' },
  modalActions: { flexDirection:'row', gap:10, marginTop:16, justifyContent:'flex-end' },
});
