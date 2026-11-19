
export interface BorrowItem {
  id: number;
  name: string;
  category: string;
  condition: string;
  deposit: number;
  available: boolean;
  icon: string;
}

export const BORROW_ITEMS: BorrowItem[] = [
  { id: 1, name: 'Canon DSLR Camera', category: 'Cameras', condition: 'Excellent', deposit: 100, available: true, icon: '📷' },
  { id: 2, name: 'MacBook Air', category: 'Electronics', condition: 'Good', deposit: 200, available: true, icon: '💻' },
  { id: 3, name: 'Electric Drill', category: 'Tools', condition: 'Excellent', deposit: 40, available: true, icon: '🔧' },
  { id: 4, name: 'Mountain Bike', category: 'Sports', condition: 'Good', deposit: 80, available: false, icon: '🚲' },
  { id: 5, name: 'PlayStation 5', category: 'Electronics', condition: 'Excellent', deposit: 150, available: true, icon: '🎮' },
  { id: 6, name: 'Camping Tent', category: 'Others', condition: 'Good', deposit: 50, available: true, icon: '🏕️' },
  { id: 7, name: 'DJI Mini Drone', category: 'Electronics', condition: 'Excellent', deposit: 180, available: true, icon: '🚁' },
  { id: 8, name: 'Sony Bluetooth Speaker', category: 'Electronics', condition: 'Good', deposit: 45, available: true, icon: '🔊' },
  { id: 9, name: 'Apple iPad Pro', category: 'Electronics', condition: 'Excellent', deposit: 150, available: true, icon: '📱' },
  { id: 10, name: 'Bosch Power Drill', category: 'Tools', condition: 'Good', deposit: 50, available: true, icon: '🛠️' },
  { id: 11, name: 'Pressure Washer', category: 'Tools', condition: 'Excellent', deposit: 90, available: true, icon: '💦' },
  { id: 12, name: 'Ladder', category: 'Tools', condition: 'Good', deposit: 40, available: false, icon: '🪜' },
  { id: 13, name: 'Sony A7 III Camera', category: 'Cameras', condition: 'Excellent', deposit: 250, available: true, icon: '📸' },
  { id: 14, name: 'GoPro Hero Camera', category: 'Cameras', condition: 'Good', deposit: 100, available: true, icon: '🎥' },
  { id: 15, name: 'Camera Tripod', category: 'Cameras', condition: 'Excellent', deposit: 30, available: true, icon: '📷' },
  { id: 16, name: 'Tennis Racket Set', category: 'Sports', condition: 'Good', deposit: 35, available: true, icon: '🎾' },
  { id: 17, name: 'Football Training Kit', category: 'Sports', condition: 'Excellent', deposit: 25, available: true, icon: '⚽' },
  { id: 18, name: 'Electric Scooter', category: 'Sports', condition: 'Good', deposit: 120, available: false, icon: '🛴' },
  { id: 19, name: 'Projector', category: 'Others', condition: 'Excellent', deposit: 80, available: true, icon: '📽️' },
  { id: 20, name: 'Portable BBQ Grill', category: 'Others', condition: 'Good', deposit: 45, available: true, icon: '🍖' }
];
