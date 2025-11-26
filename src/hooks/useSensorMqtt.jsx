import { useEffect, useRef, useState } from 'react';
import mqtt from 'mqtt';

const useSensorMqtt = () => {
  const [received, setReceived] = useState(false);
  const [sensorData, setSensorData] = useState(null);
  const clientRef = useRef(null); // dùng ref để giữ kết nối

  useEffect(() => {
    const client = mqtt.connect('ws://dev.iotlab.net.vn:1884/mqtt', {
      keepalive: 60,
      reconnectPeriod: 1000,
    });

    clientRef.current = client;

    client.on('connect', () => {
      console.log('MQTT connected');
      // client.subscribe('seiot48-esp32-sensor-data', (err) => {
      client.subscribe('seiot48-sensor-data', (err) => {
        if (err) {
          console.error('Subscription error:', err);
        } else {
          console.log('Subscribed to seiot48-esp32-sensor-data');
        }
      });
    });

    client.on('message', (topic, message) => {
      // if (topic === 'seiot48-esp32-sensor-data') {
      if (topic === 'seiot48-sensor-data') {
        try {
          const msg = JSON.parse(message.toString());
          console.log('Received data 1:', msg);

          if (msg?.sensorRecords && Array.isArray(msg.sensorRecords)) {
            const resultTime = msg.resultTime ? new Date(msg.resultTime).toLocaleString() : "-";

            const updatedData = {};
            msg.sensorRecords.forEach(record => {
              const id = record.dataStreamId;
              const rawValue = parseFloat(record.result);
              updatedData[id] = {
                value: rawValue,
                time: resultTime,
                
              };
            });

            const mergeData = {deviceId: msg.deviceId, sensorRecords: updatedData};

            // setSensorData(updatedData);
            setSensorData(mergeData);
            setReceived(true);
          }
        } catch (err) {
          console.error('Failed to parse MQTT message:', err);
        }
      }
    });

    client.on('error', (err) => {
      console.error('MQTT Error:', err);
    });

    return () => {
      client.end();
    };
  }, []);

  // ✅ Thêm hàm publishMessage
  const publishMessage = (topic, message) => {
    if (clientRef.current && clientRef.current.connected) {
      const payload = typeof message === 'string' ? message : JSON.stringify(message);
      clientRef.current.publish(topic, payload, (err) => {
        if (err) {
          console.error('Failed to publish message:', err);
        } else {
          console.log(`Published to ${topic}:`, payload);
        }
      });
    } else {
      console.warn('Client not connected');
    }
  };

  return {
    sensorData,
    received,
    setReceived,
    publishMessage, // 👈 expose this
  };
};

export default useSensorMqtt;
