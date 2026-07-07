import React, { useState, useMemo } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity,
  TextInput, Alert, Linking, SafeAreaView, Share, Modal, ScrollView,
} from 'react-native';

const DUMMY_STUDENTS = [
  { id:'1', studentId:'STU001', name:'Aarav Sharma', className:'Class 5-A', parentName:'Rajesh Sharma', parentPhone:'+91 98765 40001', parentEmail:'rajesh.sharma@email.com', pickupLocation:'Green Park Main Gate', dropLocation:'Green Park Colony', subscriptionPlan:'Yearly', paymentStatus:'PAID', status:'ACTIVE', isActive:true, driverName:'Rajesh Kumar', vehicleNumber:'KA-01-AB-1234', registrationDate: Date.now()-90*86400000 },
  { id:'2', studentId:'STU002', name:'Ishita Patel', className:'Class 8-B', parentName:'Meera Patel', parentPhone:'+91 98765 40002', parentEmail:'meera.patel@email.com', pickupLocation:'Sector 15 Market', dropLocation:'Sector 15, Block C', subscriptionPlan:'Quarterly', paymentStatus:'PENDING', status:'ACTIVE', isActive:true, driverName:'Suresh Reddy', vehicleNumber:'KA-02-CD-5678', registrationDate: Date.now()-45*86400000 },
  { id:'3', studentId:'STU003', name:'Rohan Verma', className:'Class 3-C', parentName:'Anjali Verma', parentPhone:'+91 98765 40003', parentEmail:'anjali.verma@email.com', pickupLocation:'Lake View Apartments', dropLocation:'Lake View Apartments', subscriptionPlan:'Monthly', paymentStatus:'PAID', status:'ACTIVE', isActive:true, driverName:'Rajesh Kumar', vehicleNumber:'KA-01-AB-1234', registrationDate: Date.now()-30*86400000 },
  { id:'4', studentId:'STU004', name:'Sanya Gupta', className:'Class 10-A', parentName:'Vikram Gupta', parentPhone:'+91 98765 40004', parentEmail:'vikram.gupta@email.com', pickupLocation:'City Center Mall', dropLocation:'City Heights', subscriptionPlan:'Yearly', paymentStatus:'PAID', status:'ACTIVE', isActive:true, driverName:'Prakash Rao', vehicleNumber:'KA-03-EF-9012', registrationDate: Date.now()-120*86400000 },
  { id:'5', studentId:'STU005', name:'Aditya Nair', className:'Class 7-B', parentName:'Sunil Nair', parentPhone:'+91 98765 40005', parentEmail:'sunil.nair@email.com', pickupLocation:'Railway Station Road', dropLocation:'Railway Quarters', subscriptionPlan:'Monthly', paymentStatus:'PENDING', status:'INACTIVE', isActive:false, driverName:'Not Assigned', vehicleNumber:'Not Assigned', registrationDate: Date.now()-15*86400000 },
  { id:'6', studentId:'STU006', name:'Kavya Singh', className:'Class 9-C', parentName:'Ritu Singh', parentPhone:'+91 98765 40006', parentEmail:'ritu.singh@email.com', pickupLocation:'Rose Garden Colony', dropLocation:'Rose Garden Colony', subscriptionPlan:'Quarterly', paymentStatus:'PAID', status:'ACTIVE', isActive:true, driverName:'Suresh Reddy', vehicleNumber:'KA-02-CD-5678', registrationDate: Date.now()-60*86400000 },
  { id:'7', studentId:'STU007', name:'Dhruv Kapoor', className:'Class 6-A', parentName:'Neha Kapoor', parentPhone:'+91 98765 40007', parentEmail:'neha.kapoor@email.com', pickupLocation:'Sunrise Apartments', dropLocation:'Sunrise Apartments', subscriptionPlan:'Monthly', paymentStatus:'PAID', status:'ACTIVE', isActive:true, driverName:'Prakash Rao', vehicleNumber:'KA-03-EF-9012', registrationDate: Date.now()-20*86400000 },
  { id:'8', studentId:'STU008', name:'Ananya Reddy', className:'Class 4-B', parentName:'Krishna Reddy', parentPhone:'+91 98765 40008', parentEmail:'krishna.reddy@email.com', pickupLocation:'Indira Nagar', dropLocation:'Indira Nagar', subscriptionPlan:'Yearly', paymentStatus:'PAID', status:'ACTIVE', isActive:true, driverName:'Rajesh Kumar', vehicleNumber:'KA-01-AB-1234', registrationDate: Date.now()-200*86400000 },
  { id:'9', studentId:'STU009', name:'Vihaan Joshi', className:'Class 2-C', parentName:'Pooja Joshi', parentPhone:'+91 98765 40009', parentEmail:'pooja.joshi@email.com', pickupLocation:'Shastri Nagar', dropLocation:'Shastri Nagar', subscriptionPlan:'Monthly', paymentStatus:'PENDING', status:'ACTIVE', isActive:true, driverName:'Suresh Reddy', vehicleNumber:'KA-02-CD-5678', registrationDate: Date.now()-10*86400000 },
  { id:'10', studentId:'STU010', name:'Myra Malhotra', className:'Class 11-A', parentName:'Rahul Malhotra', parentPhone:'+91 98765 40010', parentEmail:'rahul.malhotra@email.com', pickupLocation:'Civil Lines', dropLocation:'Civil Lines', subscriptionPlan:'Quarterly', paymentStatus:'PAID', status:'ACTIVE', isActive:true, driverName:'Prakash Rao', vehicleNumber:'KA-03-EF-9012', registrationDate: Date.now()-75*86400000 },
  { id:'11', studentId:'STU011', name:'Arjun Mehta', className:'Class 12-B', parentName:'Deepa Mehta', parentPhone:'+91 98765 40011', parentEmail:'deepa.mehta@email.com', pickupLocation:'Model Town', dropLocation:'Model Town', subscriptionPlan:'Yearly', paymentStatus:'PAID', status:'INACTIVE', isActive:false, driverName:'Not Assigned', vehicleNumber:'Not Assigned', registrationDate: Date.now()-180*86400000 },
  { id:'12', studentId:'STU012', name:'Sia Bhatia', className:'Class 1-A', parentName:'Ankit Bhatia', parentPhone:'+91 98765 40012', parentEmail:'ankit.bhatia@email.com', pickupLocation:'Vasant Kunj', dropLocation:'Vasant Kunj', subscriptionPlan:'Monthly', paymentStatus:'PAID', status:'ACTIVE', isActive:true, driverName:'Rajesh Kumar', vehicleNumber:'KA-01-AB-1234', registrationDate: Date.now()-25*86400000 },
];

const initials = (name) => name.split(' ').slice(0,2).map(w => w[0].toUpperCase()).join('');
const formatDate = (ts) => new Date(ts).toLocaleDateString('en-IN', { day:'2-digit', month:'short', year:'numeric' });
const formatMonthYear = (ts) => new Date(ts).toLocaleDateString('en-IN', { month:'short', year:'numeric' });
const payColor = (p) => p === 'PAID' ? '#10b981' : '#f59e0b';
const statusColor = (s) => s === 'ACTIVE' ? '#10b981' : '#ef4444';

export default function StudentDetailsScreen({ navigation }) {
  const [students, setStudents] = useState(DUMMY_STUDENTS);
  const [search, setSearch] = useState('');
  const [classFilter, setClassFilter] = useState('All Classes');
  const [detailStudent, setDetailStudent] = useState(null);
  const [showClassMenu, setShowClassMenu] = useState(false);

  const classList = ['All Classes', ...Array.from(new Set(DUMMY_STUDENTS.map(s => s.className))).sort()];

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return students.filter(s =>
      (classFilter === 'All Classes' || s.className === classFilter) &&
      (!q || s.name.toLowerCase().includes(q) || s.className.toLowerCase().includes(q) || s.parentName.toLowerCase().includes(q))
    );
  }, [students, search, classFilter]);

  const total = students.length;
  const active = students.filter(s => s.status === 'ACTIVE').length;
  const pendingPayment = students.filter(s => s.paymentStatus === 'PENDING').length;

  const updatePayment = (id, newStatus) => {
    setStudents(prev => prev.map(s => s.id === id ? { ...s, paymentStatus: newStatus } : s));
    Alert.alert('', `Payment updated to ${newStatus}`);
  };

  const showPaymentDialog = (student) => {
    Alert.alert(`Payment — ${student.name}`, 'Update payment status:', [
      { text: '✅ Mark as PAID', onPress: () => updatePayment(student.id, 'PAID') },
      { text: '⏳ Mark as PENDING', onPress: () => updatePayment(student.id, 'PENDING') },
      { text: 'Cancel', style: 'cancel' },
    ]);
  };

  const contactParent = (student) => {
    Alert.alert(`Contact ${student.parentName}`, '', [
      { text: '📞 Call', onPress: () => Linking.openURL(`tel:${student.parentPhone}`) },
      { text: '📧 Email', onPress: () => Linking.openURL(`mailto:${student.parentEmail}`) },
      { text: 'Cancel', style: 'cancel' },
    ]);
  };

  const exportReport = async () => {
    if (filtered.length === 0) { Alert.alert('', 'No data to export'); return; }
    const text = 'SCHUBER STUDENT DETAILS REPORT\n' + '='.repeat(50) + '\n\n' +
      filtered.map(s => `${s.name} | ${s.className} | ${s.parentName} | ${s.paymentStatus} | ${s.status}`).join('\n');
    await Share.share({ message: text });
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backText}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Student Details</Text>
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
          <Text style={[styles.statVal, { color:'#10b981' }]}>{active}</Text>
          <Text style={styles.statLbl}>Active</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={[styles.statVal, { color:'#f59e0b' }]}>{pendingPayment}</Text>
          <Text style={styles.statLbl}>Pending Pay</Text>
        </View>
      </View>

      {/* Search + Filter */}
      <View style={styles.searchRow}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search by name, class, parent..."
          placeholderTextColor="#64748b"
          value={search}
          onChangeText={setSearch}
        />
        <TouchableOpacity style={styles.filterBtn} onPress={() => setShowClassMenu(true)}>
          <Text style={styles.filterBtnText} numberOfLines={1}>
            {classFilter === 'All Classes' ? '⚙ Class' : classFilter.replace('Class ', '')}
          </Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.countText}>{filtered.length} student{filtered.length !== 1 ? 's' : ''} found</Text>

      {/* List */}
      <FlatList
        data={filtered}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.emptyWrap}>
            <Text style={styles.emptyIcon}>🎓</Text>
            <Text style={styles.emptyText}>No students found</Text>
          </View>
        }
        renderItem={({ item }) => (
          <View style={styles.card}>
            {/* Header */}
            <View style={styles.cardHeader}>
              <View style={[styles.avatar, { backgroundColor: statusColor(item.status) }]}>
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
              <Detail label="Driver" value={item.driverName} />
              <Detail label="Joined" value={formatMonthYear(item.registrationDate)} />
            </View>

            {/* Actions */}
            <View style={styles.actions}>
              <TouchableOpacity style={styles.btnView} onPress={() => setDetailStudent(item)}>
                <Text style={styles.btnViewText}>👁 Details</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.btnContact} onPress={() => contactParent(item)}>
                <Text style={styles.btnContactText}>📞 Contact</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.btnPayment} onPress={() => showPaymentDialog(item)}>
                <Text style={styles.btnPaymentText}>💳 Payment</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />

      {/* Class Filter Modal */}
      <Modal visible={showClassMenu} transparent animationType="fade" onRequestClose={() => setShowClassMenu(false)}>
        <TouchableOpacity style={styles.modalOverlay} onPress={() => setShowClassMenu(false)}>
          <View style={styles.filterMenu}>
            <Text style={styles.filterMenuTitle}>Filter by Class</Text>
            <ScrollView style={{ maxHeight: 300 }}>
              {classList.map(c => (
                <TouchableOpacity
                  key={c}
                  style={[styles.filterOption, classFilter === c && styles.filterOptionActive]}
                  onPress={() => { setClassFilter(c); setShowClassMenu(false); }}
                >
                  <Text style={[styles.filterOptionText, classFilter === c && { color:'#3b82f6' }]}>{c}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Detail Modal */}
      <Modal visible={!!detailStudent} animationType="slide" transparent onRequestClose={() => setDetailStudent(null)}>
        <View style={styles.detailOverlay}>
          <View style={styles.detailBox}>
            <ScrollView>
              {detailStudent && (
                <>
                  <Text style={styles.modalTitle}>Student Details</Text>
                  <Text style={styles.modalSection}>📋 STUDENT INFORMATION</Text>
                  <ModalRow label="Status" value={detailStudent.status === 'ACTIVE' ? '🟢 ACTIVE' : '🔴 INACTIVE'} />
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
                  <Text style={styles.modalSection}>🚗 ASSIGNED VEHICLE</Text>
                  <ModalRow label="Driver" value={detailStudent.driverName} />
                  <ModalRow label="Vehicle" value={detailStudent.vehicleNumber} />
                  <Text style={styles.modalSection}>💰 SUBSCRIPTION</Text>
                  <ModalRow label="Plan" value={detailStudent.subscriptionPlan} />
                  <ModalRow label="Payment" value={detailStudent.paymentStatus === 'PAID' ? '✅ PAID' : '⚠️ PENDING'} />
                  <ModalRow label="Registered" value={formatDate(detailStudent.registrationDate)} />
                </>
              )}
            </ScrollView>
            <View style={styles.modalActions}>
              {detailStudent && (
                <>
                  <TouchableOpacity style={styles.btnContact} onPress={() => { contactParent(detailStudent); setDetailStudent(null); }}>
                    <Text style={styles.btnContactText}>📞 Contact</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.btnPayment} onPress={() => { showPaymentDialog(detailStudent); setDetailStudent(null); }}>
                    <Text style={styles.btnPaymentText}>💳 Payment</Text>
                  </TouchableOpacity>
                </>
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
  searchRow: { flexDirection:'row', marginHorizontal:16, marginBottom:6, gap:8 },
  searchInput: { flex:1, backgroundColor:'#1e293b', borderRadius:10, paddingHorizontal:14, paddingVertical:10, color:'#f1f5f9', fontSize:14, borderWidth:1, borderColor:'#334155' },
  filterBtn: { backgroundColor:'#1e293b', borderRadius:10, paddingHorizontal:12, paddingVertical:10, borderWidth:1, borderColor:'#334155', justifyContent:'center', minWidth:70 },
  filterBtnText: { color:'#94a3b8', fontSize:12, fontWeight:'600' },
  countText: { color:'#64748b', fontSize:12, marginHorizontal:20, marginBottom:8 },
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
  btnContact: { backgroundColor:'#1e40af33', borderRadius:8, paddingHorizontal:12, paddingVertical:7, borderWidth:1, borderColor:'#3b82f655' },
  btnContactText: { color:'#3b82f6', fontSize:12, fontWeight:'600' },
  btnPayment: { backgroundColor:'#78350f33', borderRadius:8, paddingHorizontal:12, paddingVertical:7, borderWidth:1, borderColor:'#f59e0b55' },
  btnPaymentText: { color:'#f59e0b', fontSize:12, fontWeight:'600' },
  modalOverlay: { flex:1, backgroundColor:'#000000aa', justifyContent:'center', alignItems:'center' },
  filterMenu: { backgroundColor:'#1e293b', borderRadius:16, padding:20, width:240 },
  filterMenuTitle: { color:'#f1f5f9', fontSize:15, fontWeight:'700', marginBottom:12 },
  filterOption: { paddingVertical:10, paddingHorizontal:8, borderRadius:8 },
  filterOptionActive: { backgroundColor:'#3b82f622' },
  filterOptionText: { color:'#cbd5e1', fontSize:14 },
  detailOverlay: { flex:1, backgroundColor:'#000000aa', justifyContent:'center', alignItems:'center', padding:20 },
  detailBox: { backgroundColor:'#1e293b', borderRadius:16, padding:20, width:'100%', maxHeight:'85%' },
  modalTitle: { color:'#f1f5f9', fontSize:18, fontWeight:'700', marginBottom:16, textAlign:'center' },
  modalSection: { color:'#94a3b8', fontSize:12, fontWeight:'700', letterSpacing:1, marginTop:12, marginBottom:6 },
  modalRow: { flexDirection:'row', marginBottom:6 },
  modalLabel: { color:'#64748b', fontSize:13, width:100 },
  modalValue: { color:'#cbd5e1', fontSize:13, flex:1, fontWeight:'500' },
  modalActions: { flexDirection:'row', gap:8, marginTop:16, justifyContent:'flex-end', flexWrap:'wrap' },
});
