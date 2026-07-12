import React, { useState, useMemo } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity,
  TextInput, Alert, Linking, SafeAreaView, Share, Modal, ScrollView,
} from 'react-native';

const DUMMY_DRIVERS = [
  { id:'1', driverId:'DRV101', name:'Ramesh Patil', email:'ramesh@email.com', phone:'+91 98001 11001', vehicleNumber:'KA-01-ZA-0011', vehicleModel:'Toyota Innova', vehicleColor:'White', vehicleCapacity:7, licenseNumber:'DL-KA1234501', experience:6, status:'PENDING', registrationDate: Date.now()-5*86400000, assignedRouteName:'Route A' },
  { id:'2', driverId:'DRV102', name:'Sujit Rao', email:'sujit@email.com', phone:'+91 98001 11002', vehicleNumber:'KA-02-ZB-0022', vehicleModel:'Mahindra Marazzo', vehicleColor:'Silver', vehicleCapacity:8, licenseNumber:'DL-KA1234502', experience:3, status:'PENDING', registrationDate: Date.now()-3*86400000, assignedRouteName:null },
  { id:'3', driverId:'DRV103', name:'Anand Kumar', email:'anand@email.com', phone:'+91 98001 11003', vehicleNumber:'KA-03-ZC-0033', vehicleModel:'Force Traveller', vehicleColor:'Blue', vehicleCapacity:12, licenseNumber:'DL-KA1234503', experience:10, status:'APPROVED', registrationDate: Date.now()-30*86400000, assignedRouteName:'Route B' },
  { id:'4', driverId:'DRV104', name:'Naresh Gowda', email:'naresh@email.com', phone:'+91 98001 11004', vehicleNumber:'KA-04-ZD-0044', vehicleModel:'Tata Winger', vehicleColor:'White', vehicleCapacity:9, licenseNumber:'DL-KA1234504', experience:4, status:'APPROVED', registrationDate: Date.now()-45*86400000, assignedRouteName:'Route C' },
  { id:'5', driverId:'DRV105', name:'Vijay Shetty', email:'vijay@email.com', phone:'+91 98001 11005', vehicleNumber:'KA-05-ZE-0055', vehicleModel:'Force Citiline', vehicleColor:'Grey', vehicleCapacity:10, licenseNumber:'DL-KA1234505', experience:7, status:'PENDING', registrationDate: Date.now()-2*86400000, assignedRouteName:null },
  { id:'6', driverId:'DRV106', name:'Mahesh Babu', email:'mahesh@email.com', phone:'+91 98001 11006', vehicleNumber:'KA-06-ZF-0066', vehicleModel:'Tata Magic', vehicleColor:'Yellow', vehicleCapacity:6, licenseNumber:'DL-KA1234506', experience:2, status:'APPROVED', registrationDate: Date.now()-60*86400000, assignedRouteName:'Route D' },
];

export default function DriverApprovalScreen({ navigation }) {
  const [drivers, setDrivers] = useState(DUMMY_DRIVERS);
  const [search, setSearch] = useState('');
  const [tab, setTab] = useState('PENDING');
  const [detailDriver, setDetailDriver] = useState(null);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return drivers.filter(d =>
      d.status === tab &&
      (!q || d.name.toLowerCase().includes(q) || d.vehicleNumber.toLowerCase().includes(q) ||
       d.phone.includes(q) || d.driverId.toLowerCase().includes(q))
    );
  }, [drivers, search, tab]);

  const total = drivers.length;
  const pending = drivers.filter(d => d.status === 'PENDING').length;
  const approved = drivers.filter(d => d.status === 'APPROVED').length;

  const updateStatus = (id, status) => {
    setDrivers(prev => prev.map(d => d.id === id ? { ...d, status } : d));
  };

  const showApproveDialog = (driver) => {
    Alert.alert(
      'Approve Driver',
      `Approve ${driver.name} as a driver?\n\nVehicle: ${driver.vehicleNumber}\nLicense: ${driver.licenseNumber}\nExperience: ${driver.experience} years`,
      [
        { text: 'Approve', onPress: () => { updateStatus(driver.id, 'APPROVED'); Alert.alert('', `${driver.name} approved!`); } },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  const showRejectDialog = (driver) => {
    Alert.alert(
      'Reject Driver',
      `Are you sure you want to reject ${driver.name}?`,
      [
        { text: 'Reject', style: 'destructive', onPress: () => { updateStatus(driver.id, 'REJECTED'); } },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  const contactDriver = (driver) => {
    Alert.alert(`Contact ${driver.name}`, '', [
      { text: '📞 Call', onPress: () => Linking.openURL(`tel:${driver.phone}`) },
      { text: '📧 Email', onPress: () => Linking.openURL(`mailto:${driver.email}?subject=Regarding your driver application`) },
      { text: 'Cancel', style: 'cancel' },
    ]);
  };

  const exportReport = async () => {
    if (filtered.length === 0) { Alert.alert('', 'No data to export'); return; }
    const text = 'SCHUBER DRIVER REPORT\n' + '='.repeat(50) + '\n\n' +
      filtered.map(d => `${d.name} | ${d.vehicleNumber} | ${d.status}`).join('\n');
    await Share.share({ message: text });
  };

  const formatDate = (ts) => new Date(ts).toLocaleDateString('en-IN', { day:'2-digit', month:'short', year:'numeric' });

  const initials = (name) => name.split(' ').slice(0,2).map(w => w[0].toUpperCase()).join('');

  const statusColor = (s) => s === 'APPROVED' ? '#2FAE60' : s === 'PENDING' ? '#E07C00' : '#E14434';
  const statusBg = (s) => s === 'APPROVED' ? '#E4F6EB' : s === 'PENDING' ? '#FBE0C6' : '#FCE8E5';

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backText}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Driver Approval</Text>
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
          <Text style={[styles.statVal, { color:'#E07C00' }]}>{pending}</Text>
          <Text style={styles.statLbl}>Pending</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={[styles.statVal, { color:'#2FAE60' }]}>{approved}</Text>
          <Text style={styles.statLbl}>Approved</Text>
        </View>
      </View>

      {/* Pending Banner */}
      {pending > 0 && (
        <View style={styles.pendingBanner}>
          <Text style={styles.pendingBannerText}>⏳ {pending} Driver{pending > 1 ? 's' : ''} Pending Approval</Text>
        </View>
      )}

      {/* Search */}
      <View style={styles.searchWrap}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search by name, vehicle, phone..."
          placeholderTextColor="#9B9B9B"
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
            <Text style={styles.emptyIcon}>🚗</Text>
            <Text style={styles.emptyText}>No {tab.toLowerCase()} drivers</Text>
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
                <Text style={styles.cardSub}>{item.email}</Text>
                <Text style={styles.cardSub}>ID: {item.driverId}</Text>
              </View>
              <View style={[styles.statusBadge, { backgroundColor: statusBg(item.status), borderColor: statusColor(item.status) }]}>
                <Text style={[styles.statusText, { color: statusColor(item.status) }]}>{item.status}</Text>
              </View>
            </View>

            {/* Details */}
            <View style={styles.detailsGrid}>
              <Detail label="Phone" value={item.phone} />
              <Detail label="Vehicle" value={item.vehicleNumber} />
              <Detail label="Model" value={item.vehicleModel} />
              <Detail label="Capacity" value={`${item.vehicleCapacity} seats`} />
              <Detail label="License" value={item.licenseNumber} />
              <Detail label="Experience" value={`${item.experience} yrs`} />
              <Detail label="Route" value={item.assignedRouteName || 'Not Assigned'} />
              <Detail label="Registered" value={formatDate(item.registrationDate)} />
            </View>

            {/* Actions */}
            <View style={styles.actions}>
              <TouchableOpacity style={styles.btnView} onPress={() => setDetailDriver(item)}>
                <Text style={styles.btnViewText}>👁 Details</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.btnContact} onPress={() => contactDriver(item)}>
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
      <Modal visible={!!detailDriver} animationType="slide" transparent onRequestClose={() => setDetailDriver(null)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <ScrollView>
              {detailDriver && (
                <>
                  <Text style={styles.modalTitle}>Driver Details</Text>
                  <Text style={styles.modalSection}>📋 DRIVER INFORMATION</Text>
                  <ModalRow label="ID" value={detailDriver.driverId} />
                  <ModalRow label="Name" value={detailDriver.name} />
                  <ModalRow label="Email" value={detailDriver.email} />
                  <ModalRow label="Phone" value={detailDriver.phone} />
                  <Text style={styles.modalSection}>🚗 VEHICLE DETAILS</Text>
                  <ModalRow label="Number" value={detailDriver.vehicleNumber} />
                  <ModalRow label="Model" value={detailDriver.vehicleModel} />
                  <ModalRow label="Color" value={detailDriver.vehicleColor} />
                  <ModalRow label="Capacity" value={`${detailDriver.vehicleCapacity} seats`} />
                  <Text style={styles.modalSection}>📜 LICENSE</Text>
                  <ModalRow label="Number" value={detailDriver.licenseNumber} />
                  <ModalRow label="Experience" value={`${detailDriver.experience} years`} />
                  <ModalRow label="Registered" value={formatDate(detailDriver.registrationDate)} />
                  <ModalRow label="Status" value={detailDriver.status} />
                  <ModalRow label="Route" value={detailDriver.assignedRouteName || 'Not Assigned'} />
                </>
              )}
            </ScrollView>
            <View style={styles.modalActions}>
              {detailDriver && (
                <TouchableOpacity style={styles.btnContact} onPress={() => { contactDriver(detailDriver); setDetailDriver(null); }}>
                  <Text style={styles.btnContactText}>📞 Contact</Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity style={styles.btnView} onPress={() => setDetailDriver(null)}>
                <Text style={styles.btnViewText}>Close</Text>
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

const styles = StyleSheet.create({
  container: { flex:1, backgroundColor:'#FFF7E1' },
  header: { flexDirection:'row', alignItems:'center', justifyContent:'space-between', padding:16, paddingTop:8 },
  backBtn: { padding:8 },
  backText: { color:'#1F1B24', fontSize:32, lineHeight:36 },
  headerTitle: { color:'#1F1B24', fontSize:18, fontWeight:'700' },
  exportBtn: { color:'#664EA4', fontSize:14, fontWeight:'600' },
  statsRow: { flexDirection:'row', marginHorizontal:16, marginBottom:10, backgroundColor:'#FFFFFF', borderRadius:12, padding:12, borderWidth:1, borderColor:'#EFEAE0' },
  statBox: { flex:1, alignItems:'center' },
  statVal: { color:'#1F1B24', fontSize:22, fontWeight:'800' },
  statLbl: { color:'#6B6B6B', fontSize:11, marginTop:2 },
  pendingBanner: { marginHorizontal:16, backgroundColor:'#FBE0C6', borderRadius:8, padding:10, marginBottom:8, borderWidth:1, borderColor:'#F4941A55' },
  pendingBannerText: { color:'#E07C00', fontSize:13, fontWeight:'600', textAlign:'center' },
  searchWrap: { marginHorizontal:16, marginBottom:10 },
  searchInput: { backgroundColor:'#FFFFFF', borderRadius:10, paddingHorizontal:14, paddingVertical:10, color:'#1F1B24', fontSize:14, borderWidth:1, borderColor:'#EFEAE0' },
  tabs: { flexDirection:'row', marginHorizontal:16, marginBottom:12, backgroundColor:'#F6F6F6', borderRadius:10, padding:4 },
  tab: { flex:1, paddingVertical:8, borderRadius:8, alignItems:'center' },
  tabActivePending: { backgroundColor:'#F4941A' },
  tabActiveApproved: { backgroundColor:'#2FAE60' },
  tabText: { color:'#6B6B6B', fontWeight:'600', fontSize:14 },
  tabTextActive: { color:'#fff' },
  list: { paddingHorizontal:16, paddingBottom:30 },
  emptyWrap: { alignItems:'center', paddingTop:60 },
  emptyIcon: { fontSize:48, marginBottom:12 },
  emptyText: { color:'#9B9B9B', fontSize:16 },
  card: { backgroundColor:'#FFFFFF', borderRadius:14, padding:16, marginBottom:12, borderWidth:1, borderColor:'#EFEAE0' },
  cardHeader: { flexDirection:'row', alignItems:'center', marginBottom:12 },
  avatar: { width:44, height:44, borderRadius:22, backgroundColor:'#664EA4', justifyContent:'center', alignItems:'center', marginRight:12 },
  avatarText: { color:'#fff', fontWeight:'700', fontSize:14 },
  cardInfo: { flex:1 },
  cardName: { color:'#1F1B24', fontSize:15, fontWeight:'700' },
  cardSub: { color:'#6B6B6B', fontSize:12, marginTop:1 },
  statusBadge: { borderRadius:8, paddingHorizontal:8, paddingVertical:3, borderWidth:1 },
  statusText: { fontSize:11, fontWeight:'700' },
  detailsGrid: { flexDirection:'row', flexWrap:'wrap', marginBottom:12 },
  detailItem: { width:'50%', marginBottom:6 },
  detailLabel: { color:'#9B9B9B', fontSize:11 },
  detailValue: { color:'#1F1B24', fontSize:13, fontWeight:'500' },
  actions: { flexDirection:'row', flexWrap:'wrap', gap:8 },
  btnView: { backgroundColor:'#F6F6F6', borderRadius:8, paddingHorizontal:12, paddingVertical:7, borderWidth:1, borderColor:'#EFEAE0' },
  btnViewText: { color:'#1F1B24', fontSize:12, fontWeight:'600' },
  btnContact: { backgroundColor:'#664EA422', borderRadius:8, paddingHorizontal:12, paddingVertical:7, borderWidth:1, borderColor:'#664EA455' },
  btnContactText: { color:'#4E3A85', fontSize:12, fontWeight:'600' },
  btnApprove: { backgroundColor:'#E4F6EB', borderRadius:8, paddingHorizontal:12, paddingVertical:7, borderWidth:1, borderColor:'#2FAE6055' },
  btnApproveText: { color:'#2FAE60', fontSize:12, fontWeight:'600' },
  btnReject: { backgroundColor:'#FCE8E5', borderRadius:8, paddingHorizontal:12, paddingVertical:7, borderWidth:1, borderColor:'#E1443455' },
  btnRejectText: { color:'#E14434', fontSize:12, fontWeight:'600' },
  modalOverlay: { flex:1, backgroundColor:'#1F1B24aa', justifyContent:'center', alignItems:'center', padding:20 },
  modalBox: { backgroundColor:'#FFFFFF', borderRadius:16, padding:20, width:'100%', maxHeight:'80%' },
  modalTitle: { color:'#1F1B24', fontSize:18, fontWeight:'700', marginBottom:16, textAlign:'center' },
  modalSection: { color:'#664EA4', fontSize:12, fontWeight:'700', letterSpacing:1, marginTop:12, marginBottom:6 },
  modalRow: { flexDirection:'row', marginBottom:6 },
  modalLabel: { color:'#9B9B9B', fontSize:13, width:100 },
  modalValue: { color:'#1F1B24', fontSize:13, flex:1, fontWeight:'500' },
  modalActions: { flexDirection:'row', gap:10, marginTop:16, justifyContent:'flex-end' },
});