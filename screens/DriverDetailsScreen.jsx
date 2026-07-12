import React, { useState, useMemo } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity,
  TextInput, Alert, Linking, SafeAreaView, Share, Modal, ScrollView,
} from 'react-native';

const DUMMY_DRIVERS = [
  { id:'1', driverId:'DRV001', name:'Rajesh Kumar', email:'rajesh.kumar@schuber.com', phone:'+91 98765 40001', vehicleNumber:'KA-01-AB-1234', vehicleModel:'Toyota Innova Crysta', vehicleColor:'White', vehicleCapacity:7, licenseNumber:'DL-1234567890', experience:8, rating:4.8, totalTrips:342, status:'ON DUTY', assignedStudents:6, assignedRoute:'Route A - North Zone', joinDate: Date.now()-3*365*86400000 },
  { id:'2', driverId:'DRV002', name:'Suresh Reddy', email:'suresh.reddy@schuber.com', phone:'+91 98765 40002', vehicleNumber:'KA-02-CD-5678', vehicleModel:'Mahindra Marazzo', vehicleColor:'Silver', vehicleCapacity:8, licenseNumber:'DL-2345678901', experience:5, rating:4.6, totalTrips:189, status:'ACTIVE', assignedStudents:4, assignedRoute:'Route B - East Zone', joinDate: Date.now()-2*365*86400000 },
  { id:'3', driverId:'DRV003', name:'Prakash Rao', email:'prakash.rao@schuber.com', phone:'+91 98765 40003', vehicleNumber:'KA-03-EF-9012', vehicleModel:'Force Traveller', vehicleColor:'Blue', vehicleCapacity:12, licenseNumber:'DL-3456789012', experience:10, rating:4.9, totalTrips:521, status:'ON DUTY', assignedStudents:10, assignedRoute:'Route C - West Zone', joinDate: Date.now()-5*365*86400000 },
  { id:'4', driverId:'DRV004', name:'Manoj Singh', email:'manoj.singh@schuber.com', phone:'+91 98765 40004', vehicleNumber:'KA-04-GH-3456', vehicleModel:'Tata Winger', vehicleColor:'White', vehicleCapacity:9, licenseNumber:'DL-4567890123', experience:3, rating:4.2, totalTrips:78, status:'OFF DUTY', assignedStudents:0, assignedRoute:'Not Assigned', joinDate: Date.now()-365*86400000 },
  { id:'5', driverId:'DRV005', name:'Venkatesh', email:'venkatesh@schuber.com', phone:'+91 98765 40005', vehicleNumber:'KA-05-IJ-7890', vehicleModel:'Toyota Hilux', vehicleColor:'Black', vehicleCapacity:5, licenseNumber:'DL-5678901234', experience:6, rating:4.7, totalTrips:234, status:'ACTIVE', assignedStudents:3, assignedRoute:'Route D - South Zone', joinDate: Date.now()-2*365*86400000 },
  { id:'6', driverId:'DRV006', name:'Karthik Shetty', email:'karthik@schuber.com', phone:'+91 98765 40006', vehicleNumber:'KA-06-KL-1234', vehicleModel:'Mahindra XUV500', vehicleColor:'Red', vehicleCapacity:7, licenseNumber:'DL-6789012345', experience:4, rating:4.5, totalTrips:156, status:'ON DUTY', assignedStudents:5, assignedRoute:'Route E - Central Zone', joinDate: Date.now()-365*86400000 },
  { id:'7', driverId:'DRV007', name:'Naveen Gowda', email:'naveen@schuber.com', phone:'+91 98765 40007', vehicleNumber:'KA-07-MN-5678', vehicleModel:'Force Citiline', vehicleColor:'Grey', vehicleCapacity:10, licenseNumber:'DL-7890123456', experience:7, rating:4.8, totalTrips:298, status:'ACTIVE', assignedStudents:8, assignedRoute:'Route F - Old City', joinDate: Date.now()-3*365*86400000 },
  { id:'8', driverId:'DRV008', name:'Ramesh Bhat', email:'ramesh.bhat@schuber.com', phone:'+91 98765 40008', vehicleNumber:'KA-08-OP-9012', vehicleModel:'Tata Magic', vehicleColor:'Yellow', vehicleCapacity:6, licenseNumber:'DL-8901234567', experience:2, rating:4.1, totalTrips:45, status:'INACTIVE', assignedStudents:0, assignedRoute:'Not Assigned', joinDate: Date.now()-180*86400000 },
  { id:'9', driverId:'DRV009', name:'Ganesh Kamath', email:'ganesh@schuber.com', phone:'+91 98765 40009', vehicleNumber:'KA-09-QR-3456', vehicleModel:'Toyota Qualis', vehicleColor:'White', vehicleCapacity:8, licenseNumber:'DL-9012345678', experience:9, rating:4.9, totalTrips:412, status:'ON DUTY', assignedStudents:7, assignedRoute:'Route G - Suburbs', joinDate: Date.now()-4*365*86400000 },
  { id:'10', driverId:'DRV010', name:'Umesh Yadav', email:'umesh@schuber.com', phone:'+91 98765 40010', vehicleNumber:'KA-10-ST-7890', vehicleModel:'Ashok Leyland', vehicleColor:'Blue', vehicleCapacity:15, licenseNumber:'DL-0123456789', experience:12, rating:4.9, totalTrips:678, status:'ACTIVE', assignedStudents:12, assignedRoute:'Route H - Industrial Area', joinDate: Date.now()-6*365*86400000 },
  { id:'11', driverId:'DRV011', name:'Harish K', email:'harish@schuber.com', phone:'+91 98765 40011', vehicleNumber:'KA-11-UV-2345', vehicleModel:'Eicher Polaris', vehicleColor:'Green', vehicleCapacity:10, licenseNumber:'DL-1234509876', experience:4, rating:4.4, totalTrips:123, status:'OFF DUTY', assignedStudents:0, assignedRoute:'Not Assigned', joinDate: Date.now()-200*86400000 },
  { id:'12', driverId:'DRV012', name:'Srinivas Murthy', email:'srinivas@schuber.com', phone:'+91 98765 40012', vehicleNumber:'KA-12-WX-6789', vehicleModel:'Tata Starbus', vehicleColor:'Orange', vehicleCapacity:20, licenseNumber:'DL-2345609876', experience:15, rating:5.0, totalTrips:892, status:'ON DUTY', assignedStudents:18, assignedRoute:'Route I - Express', joinDate: Date.now()-7*365*86400000 },
];

const STATUS_FILTERS = ['All', 'ACTIVE', 'ON DUTY', 'OFF DUTY', 'INACTIVE'];

const statusColor = (s) => ({ 'ON DUTY':'#664EA4', 'ACTIVE':'#2FAE60', 'OFF DUTY':'#E07C00', 'INACTIVE':'#E14434' }[s] || '#6B6B6B');
const statusBg = (s) => ({ 'ON DUTY':'#664EA422', 'ACTIVE':'#E4F6EB', 'OFF DUTY':'#FBE0C6', 'INACTIVE':'#FCE8E5' }[s] || '#F6F6F6');
const statusIcon = (s) => ({ 'ON DUTY':'🔵', 'ACTIVE':'🟢', 'OFF DUTY':'⭕', 'INACTIVE':'🔴' }[s] || '⚪');
const initials = (name) => name.split(' ').slice(0,2).map(w => w[0].toUpperCase()).join('');
const formatDate = (ts) => new Date(ts).toLocaleDateString('en-IN', { day:'2-digit', month:'short', year:'numeric' });

export default function DriverDetailsScreen({ navigation }) {
  const [drivers, setDrivers] = useState(DUMMY_DRIVERS);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [detailDriver, setDetailDriver] = useState(null);
  const [showFilterMenu, setShowFilterMenu] = useState(false);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return drivers.filter(d =>
      (statusFilter === 'All' || d.status === statusFilter) &&
      (!q || d.name.toLowerCase().includes(q) || d.vehicleNumber.toLowerCase().includes(q) || d.driverId.toLowerCase().includes(q))
    );
  }, [drivers, search, statusFilter]);

  const total = drivers.length;
  const active = drivers.filter(d => d.status === 'ACTIVE' || d.status === 'ON DUTY').length;
  const onDuty = drivers.filter(d => d.status === 'ON DUTY').length;

  const toggleStatus = (driver) => {
    const options = {
      'ACTIVE': ['ON DUTY', 'OFF DUTY', 'INACTIVE'],
      'ON DUTY': ['ACTIVE', 'OFF DUTY'],
      'OFF DUTY': ['ACTIVE', 'INACTIVE'],
      'INACTIVE': ['ACTIVE'],
    }[driver.status] || ['ACTIVE'];

    Alert.alert(`Update Status — ${driver.name}`, 'Choose new status:',
      options.map(s => ({ text: `${statusIcon(s)} ${s}`, onPress: () => {
        setDrivers(prev => prev.map(d => d.id === driver.id ? { ...d, status: s } : d));
        Alert.alert('', `Status updated to ${s}`);
      }})).concat([{ text: 'Cancel', style: 'cancel' }])
    );
  };

  const contactDriver = (driver) => {
    Alert.alert(`Contact ${driver.name}`, '', [
      { text: '📞 Call', onPress: () => Linking.openURL(`tel:${driver.phone}`) },
      { text: '📧 Email', onPress: () => Linking.openURL(`mailto:${driver.email}`) },
      { text: 'Cancel', style: 'cancel' },
    ]);
  };

  const exportReport = async () => {
    if (filtered.length === 0) { Alert.alert('', 'No data to export'); return; }
    const text = 'SCHUBER DRIVER DETAILS REPORT\n' + '='.repeat(50) + '\n\n' +
      filtered.map(d => `${d.name} | ${d.vehicleNumber} | ⭐${d.rating.toFixed(1)} | ${d.status}`).join('\n');
    await Share.share({ message: text });
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backText}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Driver Details</Text>
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
          <Text style={[styles.statVal, { color:'#2FAE60' }]}>{active}</Text>
          <Text style={styles.statLbl}>Active</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={[styles.statVal, { color:'#664EA4' }]}>{onDuty}</Text>
          <Text style={styles.statLbl}>On Duty</Text>
        </View>
      </View>

      {/* Search + Filter */}
      <View style={styles.searchRow}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search by name, vehicle, ID..."
          placeholderTextColor="#9B9B9B"
          value={search}
          onChangeText={setSearch}
        />
        <TouchableOpacity style={styles.filterBtn} onPress={() => setShowFilterMenu(true)}>
          <Text style={styles.filterBtnText}>{statusFilter === 'All' ? '⚙ Filter' : statusFilter}</Text>
        </TouchableOpacity>
      </View>

      {/* Count */}
      <Text style={styles.countText}>{filtered.length} driver{filtered.length !== 1 ? 's' : ''} found</Text>

      {/* List */}
      <FlatList
        data={filtered}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.emptyWrap}>
            <Text style={styles.emptyIcon}>🚌</Text>
            <Text style={styles.emptyText}>No drivers found</Text>
          </View>
        }
        renderItem={({ item }) => (
          <View style={styles.card}>
            {/* Card Header */}
            <View style={styles.cardHeader}>
              <View style={[styles.avatar, { backgroundColor: statusColor(item.status) }]}>
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

            {/* Details Grid */}
            <View style={styles.detailsGrid}>
              <Detail label="Phone" value={item.phone} />
              <Detail label="Vehicle" value={item.vehicleNumber} />
              <Detail label="Model" value={item.vehicleModel} />
              <Detail label="Capacity" value={`${item.vehicleCapacity} seats`} />
              <Detail label="Rating" value={`⭐ ${item.rating.toFixed(1)}`} />
              <Detail label="Total Trips" value={item.totalTrips.toString()} />
              <Detail label="Students" value={`${item.assignedStudents} assigned`} />
              <Detail label="Route" value={item.assignedRoute} />
            </View>

            {/* Actions */}
            <View style={styles.actions}>
              <TouchableOpacity style={styles.btnView} onPress={() => setDetailDriver(item)}>
                <Text style={styles.btnViewText}>👁 Details</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.btnContact} onPress={() => contactDriver(item)}>
                <Text style={styles.btnContactText}>📞 Contact</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.btnToggle} onPress={() => toggleStatus(item)}>
                <Text style={styles.btnToggleText}>🔄 Status</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />

      {/* Filter Modal */}
      <Modal visible={showFilterMenu} transparent animationType="fade" onRequestClose={() => setShowFilterMenu(false)}>
        <TouchableOpacity style={styles.modalOverlay} onPress={() => setShowFilterMenu(false)}>
          <View style={styles.filterMenu}>
            <Text style={styles.filterMenuTitle}>Filter by Status</Text>
            {STATUS_FILTERS.map(f => (
              <TouchableOpacity
                key={f}
                style={[styles.filterOption, statusFilter === f && styles.filterOptionActive]}
                onPress={() => { setStatusFilter(f); setShowFilterMenu(false); }}
              >
                <Text style={[styles.filterOptionText, statusFilter === f && { color:'#664EA4', fontWeight:'700' }]}>
                  {f === 'All' ? '🔍 All' : `${statusIcon(f)} ${f}`}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Detail Modal */}
      <Modal visible={!!detailDriver} animationType="slide" transparent onRequestClose={() => setDetailDriver(null)}>
        <View style={styles.detailOverlay}>
          <View style={styles.detailBox}>
            <ScrollView>
              {detailDriver && (
                <>
                  <Text style={styles.modalTitle}>Driver Details</Text>
                  <Text style={styles.modalSection}>📋 DRIVER INFORMATION</Text>
                  <ModalRow label="Status" value={`${statusIcon(detailDriver.status)} ${detailDriver.status}`} />
                  <ModalRow label="ID" value={detailDriver.driverId} />
                  <ModalRow label="Name" value={detailDriver.name} />
                  <ModalRow label="Email" value={detailDriver.email} />
                  <ModalRow label="Phone" value={detailDriver.phone} />
                  <Text style={styles.modalSection}>🚗 VEHICLE DETAILS</Text>
                  <ModalRow label="Number" value={detailDriver.vehicleNumber} />
                  <ModalRow label="Model" value={detailDriver.vehicleModel} />
                  <ModalRow label="Color" value={detailDriver.vehicleColor} />
                  <ModalRow label="Capacity" value={`${detailDriver.vehicleCapacity} seats`} />
                  <Text style={styles.modalSection}>📜 LICENSE & PERFORMANCE</Text>
                  <ModalRow label="License" value={detailDriver.licenseNumber} />
                  <ModalRow label="Experience" value={`${detailDriver.experience} years`} />
                  <ModalRow label="Rating" value={`⭐ ${detailDriver.rating.toFixed(1)}`} />
                  <ModalRow label="Total Trips" value={detailDriver.totalTrips.toString()} />
                  <ModalRow label="Students" value={`${detailDriver.assignedStudents} assigned`} />
                  <ModalRow label="Route" value={detailDriver.assignedRoute} />
                  <ModalRow label="Joined" value={formatDate(detailDriver.joinDate)} />
                </>
              )}
            </ScrollView>
            <View style={styles.modalActions}>
              {detailDriver && (
                <>
                  <TouchableOpacity style={styles.btnContact} onPress={() => { contactDriver(detailDriver); setDetailDriver(null); }}>
                    <Text style={styles.btnContactText}>📞 Contact</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.btnToggle} onPress={() => { toggleStatus(detailDriver); setDetailDriver(null); }}>
                    <Text style={styles.btnToggleText}>🔄 Status</Text>
                  </TouchableOpacity>
                </>
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
  searchRow: { flexDirection:'row', marginHorizontal:16, marginBottom:6, gap:8 },
  searchInput: { flex:1, backgroundColor:'#FFFFFF', borderRadius:10, paddingHorizontal:14, paddingVertical:10, color:'#1F1B24', fontSize:14, borderWidth:1, borderColor:'#EFEAE0' },
  filterBtn: { backgroundColor:'#FFFFFF', borderRadius:10, paddingHorizontal:12, paddingVertical:10, borderWidth:1, borderColor:'#EFEAE0', justifyContent:'center' },
  filterBtnText: { color:'#664EA4', fontSize:12, fontWeight:'600' },
  countText: { color:'#9B9B9B', fontSize:12, marginHorizontal:20, marginBottom:8 },
  list: { paddingHorizontal:16, paddingBottom:30 },
  emptyWrap: { alignItems:'center', paddingTop:60 },
  emptyIcon: { fontSize:48, marginBottom:12 },
  emptyText: { color:'#9B9B9B', fontSize:16 },
  card: { backgroundColor:'#FFFFFF', borderRadius:14, padding:16, marginBottom:12, borderWidth:1, borderColor:'#EFEAE0' },
  cardHeader: { flexDirection:'row', alignItems:'center', marginBottom:12 },
  avatar: { width:44, height:44, borderRadius:22, justifyContent:'center', alignItems:'center', marginRight:12 },
  avatarText: { color:'#fff', fontWeight:'700', fontSize:14 },
  cardInfo: { flex:1 },
  cardName: { color:'#1F1B24', fontSize:15, fontWeight:'700' },
  cardSub: { color:'#6B6B6B', fontSize:12, marginTop:1 },
  statusBadge: { borderRadius:8, paddingHorizontal:8, paddingVertical:3, borderWidth:1 },
  statusText: { fontSize:10, fontWeight:'700' },
  detailsGrid: { flexDirection:'row', flexWrap:'wrap', marginBottom:12 },
  detailItem: { width:'50%', marginBottom:6 },
  detailLabel: { color:'#9B9B9B', fontSize:11 },
  detailValue: { color:'#1F1B24', fontSize:13, fontWeight:'500' },
  actions: { flexDirection:'row', flexWrap:'wrap', gap:8 },
  btnView: { backgroundColor:'#F6F6F6', borderRadius:8, paddingHorizontal:12, paddingVertical:7, borderWidth:1, borderColor:'#EFEAE0' },
  btnViewText: { color:'#1F1B24', fontSize:12, fontWeight:'600' },
  btnContact: { backgroundColor:'#664EA422', borderRadius:8, paddingHorizontal:12, paddingVertical:7, borderWidth:1, borderColor:'#664EA455' },
  btnContactText: { color:'#4E3A85', fontSize:12, fontWeight:'600' },
  btnToggle: { backgroundColor:'#FBE0C6', borderRadius:8, paddingHorizontal:12, paddingVertical:7, borderWidth:1, borderColor:'#F4941A55' },
  btnToggleText: { color:'#E07C00', fontSize:12, fontWeight:'600' },
  modalOverlay: { flex:1, backgroundColor:'#1F1B24aa', justifyContent:'center', alignItems:'center' },
  filterMenu: { backgroundColor:'#FFFFFF', borderRadius:16, padding:20, width:240 },
  filterMenuTitle: { color:'#1F1B24', fontSize:15, fontWeight:'700', marginBottom:12 },
  filterOption: { paddingVertical:10, paddingHorizontal:8, borderRadius:8 },
  filterOptionActive: { backgroundColor:'#664EA422' },
  filterOptionText: { color:'#1F1B24', fontSize:14 },
  detailOverlay: { flex:1, backgroundColor:'#1F1B24aa', justifyContent:'center', alignItems:'center', padding:20 },
  detailBox: { backgroundColor:'#FFFFFF', borderRadius:16, padding:20, width:'100%', maxHeight:'85%' },
  modalTitle: { color:'#1F1B24', fontSize:18, fontWeight:'700', marginBottom:16, textAlign:'center' },
  modalSection: { color:'#664EA4', fontSize:12, fontWeight:'700', letterSpacing:1, marginTop:12, marginBottom:6 },
  modalRow: { flexDirection:'row', marginBottom:6 },
  modalLabel: { color:'#9B9B9B', fontSize:13, width:100 },
  modalValue: { color:'#1F1B24', fontSize:13, flex:1, fontWeight:'500' },
  modalActions: { flexDirection:'row', gap:8, marginTop:16, justifyContent:'flex-end', flexWrap:'wrap' },
});