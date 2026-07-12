import React, { useState, useMemo } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity,
  TextInput, Alert, SafeAreaView, Share, Modal, ScrollView,
} from 'react-native';

const DUMMY_DRIVERS = [
  { name:'Rajesh Kumar', vehicle:'KA-01-AB-1234' },
  { name:'Suresh Reddy', vehicle:'KA-02-CD-5678' },
  { name:'Prakash Rao', vehicle:'KA-03-EF-9012' },
  { name:'Venkatesh', vehicle:'KA-05-IJ-7890' },
  { name:'Karthik Shetty', vehicle:'KA-06-KL-1234' },
  { name:'Naveen Gowda', vehicle:'KA-07-MN-5678' },
  { name:'Ganesh Kamath', vehicle:'KA-09-QR-3456' },
  { name:'Umesh Yadav', vehicle:'KA-10-ST-7890' },
];

const INITIAL_ROUTES = [
  { id:'1', routeId:'RTE001', name:'Route A - North Zone', stopsArray:['School Gate','MG Road Stop','Hebbal Flyover','Nagawara Circle','Thanisandra Main Rd','Yelahanka New Town'], driverName:'Rajesh Kumar', vehicleNumber:'KA-01-AB-1234', studentCount:6, isActive:true, createdAt: Date.now()-120*86400000 },
  { id:'2', routeId:'RTE002', name:'Route B - East Zone', stopsArray:['School Gate','Indiranagar 100ft Rd','CMH Road','Old Madras Road','KR Puram Bridge','Whitefield Main'], driverName:'Suresh Reddy', vehicleNumber:'KA-02-CD-5678', studentCount:4, isActive:true, createdAt: Date.now()-100*86400000 },
  { id:'3', routeId:'RTE003', name:'Route C - West Zone', stopsArray:['School Gate','Rajajinagar 1st Block','Vijayanagar Circle','Magadi Road','Kengeri Satellite Town','Rajarajeshwari Nagar'], driverName:'Prakash Rao', vehicleNumber:'KA-03-EF-9012', studentCount:10, isActive:true, createdAt: Date.now()-90*86400000 },
  { id:'4', routeId:'RTE004', name:'Route D - South Zone', stopsArray:['School Gate','Jayanagar 4th Block','BTM Layout','Bannerghatta Road','Electronic City Phase 1','Bommasandra'], driverName:'Venkatesh', vehicleNumber:'KA-05-IJ-7890', studentCount:3, isActive:true, createdAt: Date.now()-80*86400000 },
  { id:'5', routeId:'RTE005', name:'Route E - Central Zone', stopsArray:['School Gate','MG Road','Brigade Road','Residency Road','Richmond Road','Koramangala 5th Block'], driverName:'Karthik Shetty', vehicleNumber:'KA-06-KL-1234', studentCount:5, isActive:true, createdAt: Date.now()-70*86400000 },
  { id:'6', routeId:'RTE006', name:'Route F - Old City', stopsArray:['School Gate','Shivajinagar Bus Stand','Frazer Town','Cox Town','Benson Town','Pulakeshinagar'], driverName:'Naveen Gowda', vehicleNumber:'KA-07-MN-5678', studentCount:8, isActive:true, createdAt: Date.now()-60*86400000 },
  { id:'7', routeId:'RTE007', name:'Route G - Suburbs', stopsArray:['School Gate','Hebbal Ring Road','Jakkur Aerodrome Rd','Bagalur Cross','Doddaballapur Road','Devanahalli Town'], driverName:'Ganesh Kamath', vehicleNumber:'KA-09-QR-3456', studentCount:7, isActive:true, createdAt: Date.now()-50*86400000 },
  { id:'8', routeId:'RTE008', name:'Route H - Industrial Area', stopsArray:['School Gate','Peenya Industry','Tumkur Road','Nelamangala Toll','Dobaspet Cross','Kunigal Road'], driverName:'Umesh Yadav', vehicleNumber:'KA-10-ST-7890', studentCount:12, isActive:true, createdAt: Date.now()-40*86400000 },
  { id:'9', routeId:'RTE009', name:'Route I - Express', stopsArray:['School Gate','Silk Board Junction','Marathahalli Bridge','Outer Ring Road','Sarjapur Road','Attibele'], driverName:'Srinivas Murthy', vehicleNumber:'KA-12-WX-6789', studentCount:18, isActive:true, createdAt: Date.now()-30*86400000 },
  { id:'10', routeId:'RTE010', name:'Route J - West Bypass', stopsArray:['School Gate','Yeshwanthpur Circle','Goraguntepalya','Peenya 2nd Stage','Jalahalli Cross','Hesaraghatta Main Rd'], driverName:null, vehicleNumber:null, studentCount:0, isActive:false, createdAt: Date.now()-20*86400000 },
];

export default function RouteManagementScreen({ navigation }) {
  const [routes, setRoutes] = useState(INITIAL_ROUTES);
  const [search, setSearch] = useState('');
  const [stopsRoute, setStopsRoute] = useState(null);
  const [editRoute, setEditRoute] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(null); // route
  const [formName, setFormName] = useState('');
  const [formStops, setFormStops] = useState('');

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return routes.filter(r =>
      !q || r.name.toLowerCase().includes(q) ||
      r.routeId.toLowerCase().includes(q) ||
      (r.driverName?.toLowerCase().includes(q))
    );
  }, [routes, search]);

  const total = routes.length;
  const active = routes.filter(r => r.isActive).length;
  const assigned = routes.filter(r => r.driverName).length;

  const updateRoute = (id, updates) => {
    setRoutes(prev => prev.map(r => r.id === id ? { ...r, ...updates } : r));
  };

  const toggleStatus = (route) => {
    updateRoute(route.id, { isActive: !route.isActive });
    Alert.alert('', `Route ${!route.isActive ? 'activated' : 'deactivated'}`);
  };

  const addRoute = () => {
    if (!formName.trim()) { Alert.alert('', 'Enter route name'); return; }
    if (!formStops.trim()) { Alert.alert('', 'Enter stops'); return; }
    const stops = formStops.split(',').map(s => s.trim()).filter(Boolean);
    const newId = String(routes.length + 1);
    const newRouteId = `RTE${String(routes.length + 1).padStart(3, '0')}`;
    setRoutes(prev => [{ id:newId, routeId:newRouteId, name:formName.trim(), stopsArray:stops, driverName:null, vehicleNumber:null, studentCount:0, isActive:true, createdAt:Date.now() }, ...prev]);
    Alert.alert('', `Route "${formName.trim()}" created!`);
    setFormName(''); setFormStops(''); setShowAddModal(false);
  };

  const saveEdit = () => {
    if (!formName.trim() || !formStops.trim()) { Alert.alert('', 'Fill all fields'); return; }
    const stops = formStops.split(',').map(s => s.trim()).filter(Boolean);
    updateRoute(editRoute.id, { name: formName.trim(), stopsArray: stops });
    Alert.alert('', 'Route updated!');
    setEditRoute(null); setFormName(''); setFormStops('');
  };

  const assignDriver = (route, driver) => {
    updateRoute(route.id, { driverName: driver.name, vehicleNumber: driver.vehicle });
    Alert.alert('', `${driver.name} assigned to ${route.name}`);
    setShowAssignModal(null);
  };

  const openEdit = (route) => {
    setEditRoute(route);
    setFormName(route.name);
    setFormStops(route.stopsArray.join(', '));
  };

  const stopsText = (route) => route.stopsArray.join(' → ');

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backText}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Route Management</Text>
        <TouchableOpacity style={styles.addBtn} onPress={() => { setFormName(''); setFormStops(''); setShowAddModal(true); }}>
          <Text style={styles.addBtnText}>+ Add</Text>
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
          <Text style={[styles.statVal, { color:'#664EA4' }]}>{assigned}</Text>
          <Text style={styles.statLbl}>Assigned</Text>
        </View>
      </View>

      {/* Search */}
      <View style={styles.searchWrap}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search by route name, ID, driver..."
          placeholderTextColor="#9B9B9B"
          value={search}
          onChangeText={setSearch}
        />
      </View>

      <Text style={styles.countText}>{filtered.length} route{filtered.length !== 1 ? 's' : ''} found</Text>

      {/* List */}
      <FlatList
        data={filtered}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.emptyWrap}>
            <Text style={styles.emptyIcon}>🗺️</Text>
            <Text style={styles.emptyText}>No routes found</Text>
          </View>
        }
        renderItem={({ item }) => (
          <View style={styles.card}>
            {/* Card Header */}
            <View style={styles.cardHeader}>
              <Text style={styles.routeIcon}>{item.isActive ? '🗺️' : '📍'}</Text>
              <View style={styles.cardInfo}>
                <Text style={styles.cardName}>{item.name}</Text>
                <Text style={styles.cardSub}>ID: {item.routeId} · {item.stopsArray.length} stops · {item.studentCount} students</Text>
              </View>
              <View style={[styles.statusBadge, { backgroundColor: item.isActive ? '#E4F6EB' : '#F6F6F6', borderColor: item.isActive ? '#2FAE60' : '#9B9B9B' }]}>
                <Text style={[styles.statusText, { color: item.isActive ? '#2FAE60' : '#9B9B9B' }]}>{item.isActive ? 'ACTIVE' : 'INACTIVE'}</Text>
              </View>
            </View>

            {/* Stops preview */}
            <View style={styles.stopsWrap}>
              <Text style={styles.stopsLabel}>📍 Stops</Text>
              <Text style={styles.stopsText} numberOfLines={2}>{stopsText(item)}</Text>
            </View>

            {/* Driver info */}
            <View style={styles.driverRow}>
              <View style={styles.driverInfo}>
                <Text style={styles.driverLabel}>🚗 Driver</Text>
                <Text style={styles.driverName}>{item.driverName || 'Not Assigned'}</Text>
                {item.vehicleNumber && <Text style={styles.vehicleNum}>{item.vehicleNumber}</Text>}
              </View>
            </View>

            {/* Actions */}
            <View style={styles.actions}>
              <TouchableOpacity style={styles.btnEdit} onPress={() => openEdit(item)}>
                <Text style={styles.btnEditText}>✏️ Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.btnAssign} onPress={() => setShowAssignModal(item)}>
                <Text style={styles.btnAssignText}>🚗 Assign</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.btnStops} onPress={() => setStopsRoute(item)}>
                <Text style={styles.btnStopsText}>📍 Stops</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.btnToggle, { borderColor: item.isActive ? '#E1443455' : '#2FAE6055', backgroundColor: item.isActive ? '#FCE8E5' : '#E4F6EB' }]}
                onPress={() => toggleStatus(item)}
              >
                <Text style={[styles.btnToggleText, { color: item.isActive ? '#E14434' : '#2FAE60' }]}>
                  {item.isActive ? '⏸ Deactivate' : '▶ Activate'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />

      {/* Stops Modal */}
      <Modal visible={!!stopsRoute} animationType="slide" transparent onRequestClose={() => setStopsRoute(null)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>📍 Stops — {stopsRoute?.name}</Text>
            <ScrollView style={{ maxHeight: 300 }}>
              {stopsRoute?.stopsArray.map((stop, i) => (
                <View key={i} style={styles.stopItem}>
                  <View style={styles.stopDot} />
                  <Text style={styles.stopText}>{i + 1}. {stop}</Text>
                </View>
              ))}
            </ScrollView>
            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.btnEdit} onPress={() => { openEdit(stopsRoute); setStopsRoute(null); }}>
                <Text style={styles.btnEditText}>✏️ Edit Stops</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.btnClose} onPress={() => setStopsRoute(null)}>
                <Text style={styles.btnCloseText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Add/Edit Route Modal */}
      <Modal visible={showAddModal || !!editRoute} animationType="slide" transparent onRequestClose={() => { setShowAddModal(false); setEditRoute(null); }}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>{editRoute ? '✏️ Edit Route' : '➕ Add New Route'}</Text>
            <Text style={styles.fieldLabel}>Route Name</Text>
            <TextInput
              style={styles.fieldInput}
              placeholder="e.g. Route K - Airport"
              placeholderTextColor="#9B9B9B"
              value={formName}
              onChangeText={setFormName}
            />
            <Text style={styles.fieldLabel}>Stops (comma-separated)</Text>
            <TextInput
              style={[styles.fieldInput, { minHeight: 80, textAlignVertical:'top' }]}
              placeholder="School Gate, Stop 1, Stop 2..."
              placeholderTextColor="#9B9B9B"
              value={formStops}
              onChangeText={setFormStops}
              multiline
            />
            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.btnAssign} onPress={editRoute ? saveEdit : addRoute}>
                <Text style={styles.btnAssignText}>{editRoute ? 'Update' : 'Create'}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.btnClose} onPress={() => { setShowAddModal(false); setEditRoute(null); }}>
                <Text style={styles.btnCloseText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Assign Driver Modal */}
      <Modal visible={!!showAssignModal} animationType="slide" transparent onRequestClose={() => setShowAssignModal(null)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>🚗 Assign Driver</Text>
            <Text style={styles.modalSubtitle}>{showAssignModal?.name}</Text>
            <ScrollView style={{ maxHeight: 320 }}>
              {DUMMY_DRIVERS.map((driver, i) => (
                <TouchableOpacity
                  key={i}
                  style={styles.driverOption}
                  onPress={() => { assignDriver(showAssignModal, driver); }}
                >
                  <View style={styles.driverOptionAvatar}>
                    <Text style={styles.driverOptionAvatarText}>{driver.name[0]}</Text>
                  </View>
                  <View>
                    <Text style={styles.driverOptionName}>{driver.name}</Text>
                    <Text style={styles.driverOptionVehicle}>{driver.vehicle}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <TouchableOpacity style={[styles.btnClose, { marginTop: 12 }]} onPress={() => setShowAssignModal(null)}>
              <Text style={styles.btnCloseText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex:1, backgroundColor:'#FFF7E1' },
  header: { flexDirection:'row', alignItems:'center', justifyContent:'space-between', padding:16, paddingTop:8 },
  backBtn: { padding:8 },
  backText: { color:'#1F1B24', fontSize:32, lineHeight:36 },
  headerTitle: { color:'#1F1B24', fontSize:18, fontWeight:'700' },
  addBtn: { backgroundColor:'#664EA4', borderRadius:8, paddingHorizontal:14, paddingVertical:7 },
  addBtnText: { color:'#fff', fontSize:13, fontWeight:'700' },
  statsRow: { flexDirection:'row', marginHorizontal:16, marginBottom:10, backgroundColor:'#FFFFFF', borderRadius:12, padding:12, borderWidth:1, borderColor:'#EFEAE0' },
  statBox: { flex:1, alignItems:'center' },
  statVal: { color:'#1F1B24', fontSize:22, fontWeight:'800' },
  statLbl: { color:'#6B6B6B', fontSize:11, marginTop:2 },
  searchWrap: { marginHorizontal:16, marginBottom:6 },
  searchInput: { backgroundColor:'#FFFFFF', borderRadius:10, paddingHorizontal:14, paddingVertical:10, color:'#1F1B24', fontSize:14, borderWidth:1, borderColor:'#EFEAE0' },
  countText: { color:'#9B9B9B', fontSize:12, marginHorizontal:20, marginBottom:8 },
  list: { paddingHorizontal:16, paddingBottom:30 },
  emptyWrap: { alignItems:'center', paddingTop:60 },
  emptyIcon: { fontSize:48, marginBottom:12 },
  emptyText: { color:'#9B9B9B', fontSize:16 },
  card: { backgroundColor:'#FFFFFF', borderRadius:14, padding:16, marginBottom:12, borderWidth:1, borderColor:'#EFEAE0' },
  cardHeader: { flexDirection:'row', alignItems:'center', marginBottom:10 },
  routeIcon: { fontSize:28, marginRight:12 },
  cardInfo: { flex:1 },
  cardName: { color:'#1F1B24', fontSize:15, fontWeight:'700' },
  cardSub: { color:'#6B6B6B', fontSize:12, marginTop:2 },
  statusBadge: { borderRadius:8, paddingHorizontal:8, paddingVertical:3, borderWidth:1 },
  statusText: { fontSize:10, fontWeight:'700' },
  stopsWrap: { backgroundColor:'#F6F6F6', borderRadius:8, padding:10, marginBottom:10 },
  stopsLabel: { color:'#9B9B9B', fontSize:11, marginBottom:4 },
  stopsText: { color:'#6B6B6B', fontSize:12, lineHeight:18 },
  driverRow: { marginBottom:12 },
  driverInfo: { },
  driverLabel: { color:'#9B9B9B', fontSize:11 },
  driverName: { color:'#1F1B24', fontSize:14, fontWeight:'600', marginTop:2 },
  vehicleNum: { color:'#6B6B6B', fontSize:12 },
  actions: { flexDirection:'row', flexWrap:'wrap', gap:8 },
  btnEdit: { backgroundColor:'#F6F6F6', borderRadius:8, paddingHorizontal:12, paddingVertical:7, borderWidth:1, borderColor:'#EFEAE0' },
  btnEditText: { color:'#1F1B24', fontSize:12, fontWeight:'600' },
  btnAssign: { backgroundColor:'#664EA422', borderRadius:8, paddingHorizontal:12, paddingVertical:7, borderWidth:1, borderColor:'#664EA455' },
  btnAssignText: { color:'#4E3A85', fontSize:12, fontWeight:'600' },
  btnStops: { backgroundColor:'#FBE0C6', borderRadius:8, paddingHorizontal:12, paddingVertical:7, borderWidth:1, borderColor:'#F4941A55' },
  btnStopsText: { color:'#E07C00', fontSize:12, fontWeight:'600' },
  btnToggle: { borderRadius:8, paddingHorizontal:12, paddingVertical:7, borderWidth:1 },
  btnToggleText: { fontSize:12, fontWeight:'600' },
  btnClose: { backgroundColor:'#F6F6F6', borderRadius:8, paddingHorizontal:16, paddingVertical:8, borderWidth:1, borderColor:'#EFEAE0' },
  btnCloseText: { color:'#1F1B24', fontSize:13, fontWeight:'600' },
  modalOverlay: { flex:1, backgroundColor:'#1F1B24aa', justifyContent:'center', alignItems:'center', padding:20 },
  modalBox: { backgroundColor:'#FFFFFF', borderRadius:16, padding:20, width:'100%', maxHeight:'85%' },
  modalTitle: { color:'#1F1B24', fontSize:17, fontWeight:'700', marginBottom:4, textAlign:'center' },
  modalSubtitle: { color:'#6B6B6B', fontSize:13, textAlign:'center', marginBottom:14 },
  modalActions: { flexDirection:'row', gap:10, marginTop:16, justifyContent:'flex-end' },
  stopItem: { flexDirection:'row', alignItems:'center', paddingVertical:8, borderBottomWidth:1, borderBottomColor:'#EFEAE0' },
  stopDot: { width:8, height:8, borderRadius:4, backgroundColor:'#664EA4', marginRight:10 },
  stopText: { color:'#1F1B24', fontSize:14 },
  fieldLabel: { color:'#6B6B6B', fontSize:12, fontWeight:'600', marginBottom:6, marginTop:12 },
  fieldInput: { backgroundColor:'#F6F6F6', borderWidth:1, borderColor:'#EFEAE0', borderRadius:10, padding:12, color:'#1F1B24', fontSize:14 },
  driverOption: { flexDirection:'row', alignItems:'center', paddingVertical:12, borderBottomWidth:1, borderBottomColor:'#EFEAE0' },
  driverOptionAvatar: { width:36, height:36, borderRadius:18, backgroundColor:'#664EA4', justifyContent:'center', alignItems:'center', marginRight:12 },
  driverOptionAvatarText: { color:'#fff', fontWeight:'700', fontSize:14 },
  driverOptionName: { color:'#1F1B24', fontSize:14, fontWeight:'600' },
  driverOptionVehicle: { color:'#6B6B6B', fontSize:12 },
});