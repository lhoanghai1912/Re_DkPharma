import React, {useState} from 'react';
import {Modal, View, Text, TouchableOpacity, Alert} from 'react-native';
import {Calendar, DateData} from 'react-native-calendars';
import styles from '../Transfer/transfer_styles'; // Đảm bảo rằng các style tương ứng được import

interface CalendarModalProps {
  visible: boolean;
  selectedDate: string;
  onDateSelect: (date: string) => void;
  onClose: () => void;
}
const CalendarModal: React.FC<CalendarModalProps> = ({
  visible,
  selectedDate,
  onDateSelect,
  onClose,
}) => {
  const [tempSelectedDate, setTempSelectedDate] = useState(selectedDate);

  const handleConfirm = () => {
    onDateSelect(tempSelectedDate);
    onClose();
  };
  const handleCancel = () => {
    onClose();
  };
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={() => {
        Alert.alert('Modal has been closed');
        onClose;
      }}>
      <View
        style={[
          styles.wrapModal,
          {
            flex: 1,
            justifyContent: 'center',
            alignContent: 'center',
            alignItems: 'center',
          },
        ]}>
        <Calendar
          style={[styles.calendar, {borderWidth: 1, marginTop: '7%'}]}
          onDayPress={day => {
            setTempSelectedDate(day.dateString);
          }}
          markedDates={{
            [tempSelectedDate]: {
              selected: true,
              disableTouchEvent: true,
              dotColor: 'orange',
            },
          }}></Calendar>
        <View
          style={{
            flexDirection: 'row',
            alignContent: 'center',
            justifyContent: 'space-around',
            width: '40%',
            marginTop: 15,
            alignItems: 'center',
          }}>
          <TouchableOpacity
            style={styles.footerButton}
            onPress={() => {
              handleConfirm();
            }}>
            <Text style={styles.bottonText}>Xác nhận</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.footerButton}
            onPress={() => {
              handleCancel();
            }}>
            <Text style={styles.bottonText}>Hủy bỏ</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};
export default CalendarModal;
