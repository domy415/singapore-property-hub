import { ArticleCategory } from '@prisma/client'

// Comprehensive collection of Singapore property images from Unsplash
const PROPERTY_IMAGES = {
  [ArticleCategory.MARKET_INSIGHTS]: [
    // Singapore skylines, cityscapes, and business districts - UPDATED WITH AGENT RECOMMENDATIONS
    'https://images.unsplash.com/photo-ugr4n5X4YjI?w=1200&h=630&fit=crop&q=80', // Premium Marina Bay skyline
    'https://images.unsplash.com/photo-IRhO5KF0YVc?w=1200&h=630&fit=crop&q=80', // Luxury Marina Bay twilight
    'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&h=630&fit=crop&q=80',
    'https://images.unsplash.com/photo-1524634126442-357e0eac3c14?w=1200&h=630&fit=crop&q=80',
    'https://images.unsplash.com/photo-1508964942454-1a56651d54ac?w=1200&h=630&fit=crop&q=80',
    'https://images.unsplash.com/photo-1565967511849-76a60a516170?w=1200&h=630&fit=crop&q=80',
    'https://images.unsplash.com/photo-1519897831810-a9a01aceccd1?w=1200&h=630&fit=crop&q=80',
    'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=1200&h=630&fit=crop&q=80',
    'https://images.unsplash.com/photo-1533628635777-112b2239b1c7?w=1200&h=630&fit=crop&q=80',
    'https://images.unsplash.com/photo-1596402184320-417e7178b2cd?w=1200&h=630&fit=crop&q=80',
    'https://images.unsplash.com/photo-1527066579998-dbbae57b9ca2?w=1200&h=630&fit=crop&q=80',
    'https://images.unsplash.com/photo-1555212697-194d092e3b8f?w=1200&h=630&fit=crop&q=80',
    'https://images.unsplash.com/photo-1569288063643-5d29ad64df09?w=1200&h=630&fit=crop&q=80',
    'https://images.unsplash.com/photo-1609924211018-5526c55bad5b?w=1200&h=630&fit=crop&q=80',
    'https://images.unsplash.com/photo-1542370285-b8eb8317691c?w=1200&h=630&fit=crop&q=80',
    'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=1200&h=630&fit=crop&q=80',
    'https://images.unsplash.com/photo-1567157577867-05ccb1388e66?w=1200&h=630&fit=crop&q=80',
    'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=1200&h=630&fit=crop&q=80',
    'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1f?w=1200&h=630&fit=crop&q=80',
    'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=1200&h=630&fit=crop&q=80',
    'https://images.unsplash.com/photo-1589998059171-988d887df646?w=1200&h=630&fit=crop&q=80',
    'https://images.unsplash.com/photo-1567734346040-ef402037777e?w=1200&h=630&fit=crop&q=80',
    'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=1200&h=630&fit=crop&q=80',
    'https://images.unsplash.com/photo-1543168256-418811576931?w=1200&h=630&fit=crop&q=80',
    'https://images.unsplash.com/photo-1494515843206-f3117d3f51b7?w=1200&h=630&fit=crop&q=80',
    'https://images.unsplash.com/photo-1564336235-6e1234c96e3d?w=1200&h=630&fit=crop&q=80',
    'https://images.unsplash.com/photo-1464207687429-7505649dae38?w=1200&h=630&fit=crop&q=80',
    'https://images.unsplash.com/photo-1554072675-66db59dba46f?w=1200&h=630&fit=crop&q=80',
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=630&fit=crop&q=80',
    'https://images.unsplash.com/photo-1541963463532-d68292c34d19?w=1200&h=630&fit=crop&q=80',
    'https://images.unsplash.com/photo-1624538883555-ee5b0b06eea2?w=1200&h=630&fit=crop&q=80',
    'https://images.unsplash.com/photo-1509780692481-8bd84a70a2f4?w=1200&h=630&fit=crop&q=80',
    'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1200&h=630&fit=crop&q=80',
    'https://images.unsplash.com/photo-1578895101408-1a36b834405b?w=1200&h=630&fit=crop&q=80',
    'https://images.unsplash.com/photo-1518655048521-f130df041f66?w=1200&h=630&fit=crop&q=80',
  ],
  [ArticleCategory.BUYING_GUIDE]: [
    // Home interiors, keys, contracts, modern homes
    'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1200&h=630&fit=crop&q=80',
    'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=1200&h=630&fit=crop&q=80',
    'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=1200&h=630&fit=crop&q=80',
    'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&h=630&fit=crop&q=80',
    'https://images.unsplash.com/photo-1560185893-a55cbc8c57e8?w=1200&h=630&fit=crop&q=80',
    'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200&h=630&fit=crop&q=80',
    'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=1200&h=630&fit=crop&q=80',
    'https://images.unsplash.com/photo-1558036117-15d82a90b9e0?w=1200&h=630&fit=crop&q=80',
    'https://images.unsplash.com/photo-1521747116042-5a810fda9664?w=1200&h=630&fit=crop&q=80',
    'https://images.unsplash.com/photo-1571055107559-3e67626fa8be?w=1200&h=630&fit=crop&q=80',
    'https://images.unsplash.com/photo-1613553507747-5f8d62ad8004?w=1200&h=630&fit=crop&q=80',
    'https://images.unsplash.com/photo-1582795479174-3a7c825c3db5?w=1200&h=630&fit=crop&q=80',
    'https://images.unsplash.com/photo-1556912173-3bb406ef7e77?w=1200&h=630&fit=crop&q=80',
    'https://images.unsplash.com/photo-1593696140826-c58b021acf8b?w=1200&h=630&fit=crop&q=80',
    'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=1200&h=630&fit=crop&q=80',
    'https://images.unsplash.com/photo-1509660933844-6910e12765a0?w=1200&h=630&fit=crop&q=80',
    'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=1200&h=630&fit=crop&q=80',
    'https://images.unsplash.com/photo-1505843513577-22bb7d21e455?w=1200&h=630&fit=crop&q=80',
    'https://images.unsplash.com/photo-1591117207239-788bf8de6c3b?w=1200&h=630&fit=crop&q=80',
    'https://images.unsplash.com/photo-1516062423079-7ca13cdc7f5a?w=1200&h=630&fit=crop&q=80',
    'https://images.unsplash.com/photo-1449247709967-d4461a6a6103?w=1200&h=630&fit=crop&q=80',
    'https://images.unsplash.com/photo-1511452885600-a3d2c9148a31?w=1200&h=630&fit=crop&q=80',
    'https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=1200&h=630&fit=crop&q=80',
    'https://images.unsplash.com/photo-1604754742629-3e5728249d73?w=1200&h=630&fit=crop&q=80',
    'https://images.unsplash.com/photo-1530731141654-5993c3016c77?w=1200&h=630&fit=crop&q=80',
    'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1200&h=630&fit=crop&q=80',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1200&h=630&fit=crop&q=80',
    'https://images.unsplash.com/photo-1448630360428-65456885c650?w=1200&h=630&fit=crop&q=80',
    'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?w=1200&h=630&fit=crop&q=80',
    'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1200&h=630&fit=crop&q=80',
  ],
  [ArticleCategory.INVESTMENT]: [
    // Financial charts, money, investment concepts, analytics - UPDATED WITH SINGAPORE CONTEXT
    'https://images.unsplash.com/photo-1567360425618-1594206637d2?w=1200&h=630&fit=crop&q=80', // Singapore financial district
    'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=1200&h=630&fit=crop&q=80',
    'https://images.unsplash.com/photo-1579621970795-87facc2f976d?w=1200&h=630&fit=crop&q=80',
    'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=1200&h=630&fit=crop&q=80',
    'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=1200&h=630&fit=crop&q=80',
    'https://images.unsplash.com/photo-1633158829875-e5316a358c6f?w=1200&h=630&fit=crop&q=80',
    'https://images.unsplash.com/photo-1579532537598-459ecdaf39cc?w=1200&h=630&fit=crop&q=80',
    'https://images.unsplash.com/photo-1551836022-4c4c79ecde51?w=1200&h=630&fit=crop&q=80',
    'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=1200&h=630&fit=crop&q=80',
    'https://images.unsplash.com/photo-1518458028785-8fbcd101ebb9?w=1200&h=630&fit=crop&q=80',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1200&h=630&fit=crop&q=80',
    'https://images.unsplash.com/photo-1416342504532-87a4cac2b4c4?w=1200&h=630&fit=crop&q=80',
    'https://images.unsplash.com/photo-1554224154-26032fced26d?w=1200&h=630&fit=crop&q=80',
    'https://images.unsplash.com/photo-1535320903710-d993d3d77d29?w=1200&h=630&fit=crop&q=80',
    'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&h=630&fit=crop&q=80',
    'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=1200&h=630&fit=crop&q=80',
    'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=1200&h=630&fit=crop&q=80',
    'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&h=630&fit=crop&q=80',
    'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=1200&h=630&fit=crop&q=80',
    'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=1200&h=630&fit=crop&q=80',
    'https://images.unsplash.com/photo-1586881954323-a2c5e8e4c2d4?w=1200&h=630&fit=crop&q=80',
    'https://images.unsplash.com/photo-1553729459-efe14ef6055d?w=1200&h=630&fit=crop&q=80',
    'https://images.unsplash.com/photo-1624996379697-f01d168b1a52?w=1200&h=630&fit=crop&q=80',
    'https://images.unsplash.com/photo-1619126734476-6f0838e4c2a2?w=1200&h=630&fit=crop&q=80',
    'https://images.unsplash.com/photo-1585776245991-cf89dd7fc73a?w=1200&h=630&fit=crop&q=80',
    'https://images.unsplash.com/photo-1468254095679-bbf30133c7f8?w=1200&h=630&fit=crop&q=80',
    'https://images.unsplash.com/photo-1633114128174-2f8aa49759b0?w=1200&h=630&fit=crop&q=80',
    'https://images.unsplash.com/photo-1611761906475-0bd4b2c9db8e?w=1200&h=630&fit=crop&q=80',
    'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=1200&h=630&fit=crop&q=80',
    'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&h=630&fit=crop&q=80',
  ],
  [ArticleCategory.NEIGHBORHOOD]: [
    // Singapore neighborhoods, streets, local areas, HDB estates - UPDATED WITH AGENT RECOMMENDATIONS
    'https://images.unsplash.com/photo-zIp4YexPPhQ?w=1200&h=630&fit=crop&q=80', // Authentic HDB by Danist Soh (FREE)
    'https://images.unsplash.com/photo-1565967511849-76a60a516170?w=1200&h=630&fit=crop&q=80',
    'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=1200&h=630&fit=crop&q=80',
    'https://images.unsplash.com/photo-1547919307-1ecb10702e6f?w=1200&h=630&fit=crop&q=80',
    'https://images.unsplash.com/photo-1555217851-6141535bd771?w=1200&h=630&fit=crop&q=80',
    'https://images.unsplash.com/photo-1542370285-b8eb8317691c?w=1200&h=630&fit=crop&q=80',
    'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=1200&h=630&fit=crop&q=80',
    'https://images.unsplash.com/photo-1567157577867-05ccb1388e66?w=1200&h=630&fit=crop&q=80',
    'https://images.unsplash.com/photo-1498036882173-b41c28a8ba34?w=1200&h=630&fit=crop&q=80',
    'https://images.unsplash.com/photo-1544963950-d9372d4c6494?w=1200&h=630&fit=crop&q=80',
    'https://images.unsplash.com/photo-1571675670505-f9439d8b78e3?w=1200&h=630&fit=crop&q=80',
    'https://images.unsplash.com/photo-1545558014-8692077e9b5c?w=1200&h=630&fit=crop&q=80',
    'https://images.unsplash.com/photo-1558336502-6c2ce8d6f91a?w=1200&h=630&fit=crop&q=80',
    'https://images.unsplash.com/photo-1591696205602-2f950c417cb9?w=1200&h=630&fit=crop&q=80',
    'https://images.unsplash.com/photo-1581092335878-9ecd8ea9ac85?w=1200&h=630&fit=crop&q=80',
    'https://images.unsplash.com/photo-1590076918702-a9b6ccf4a38b?w=1200&h=630&fit=crop&q=80',
    'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=1200&h=630&fit=crop&q=80',
    'https://images.unsplash.com/photo-1520637836862-4d197d17c13a?w=1200&h=630&fit=crop&q=80',
    'https://images.unsplash.com/photo-1516062423079-7ca13cdc7f5a?w=1200&h=630&fit=crop&q=80',
    'https://images.unsplash.com/photo-1571059530264-d5b55bdf7755?w=1200&h=630&fit=crop&q=80',
    'https://images.unsplash.com/photo-1571059409994-b46af7efd1d1?w=1200&h=630&fit=crop&q=80',
    'https://images.unsplash.com/photo-1484804959297-65e7c19d7c9f?w=1200&h=630&fit=crop&q=80',
    'https://images.unsplash.com/photo-1560707303-4e980ce876ad?w=1200&h=630&fit=crop&q=80',
    'https://images.unsplash.com/photo-1548440062-b6c66c25b8f4?w=1200&h=630&fit=crop&q=80',
    'https://images.unsplash.com/photo-1529408632839-a54952c491e5?w=1200&h=630&fit=crop&q=80',
    'https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?w=1200&h=630&fit=crop&q=80',
    'https://images.unsplash.com/photo-1486335370669-e92ed244026e?w=1200&h=630&fit=crop&q=80',
    'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=1200&h=630&fit=crop&q=80',
    'https://images.unsplash.com/photo-1556739227-bd9d9e4f0e05?w=1200&h=630&fit=crop&q=80',
    'https://images.unsplash.com/photo-1503387837-b154d5074bd2?w=1200&h=630&fit=crop&q=80',
  ],
  [ArticleCategory.PROPERTY_NEWS]: [
    // News, documents, announcements, reports
    'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=1200&h=630&fit=crop&q=80',
    'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=1200&h=630&fit=crop&q=80',
    'https://images.unsplash.com/photo-1434626881859-194d67b2b86f?w=1200&h=630&fit=crop&q=80',
    'https://images.unsplash.com/photo-1586339949916-3e9457bef6d3?w=1200&h=630&fit=crop&q=80',
    'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=1200&h=630&fit=crop&q=80',
    'https://images.unsplash.com/photo-1572883454114-1cf0031ede2a?w=1200&h=630&fit=crop&q=80',
    'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=1200&h=630&fit=crop&q=80',
    'https://images.unsplash.com/photo-1495020689067-958852a7765e?w=1200&h=630&fit=crop&q=80',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1200&h=630&fit=crop&q=80',
    'https://images.unsplash.com/photo-1552664730-d307ca884978?w=1200&h=630&fit=crop&q=80',
    'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=1200&h=630&fit=crop&q=80',
    'https://images.unsplash.com/photo-1543168256-418811576931?w=1200&h=630&fit=crop&q=80',
    'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=1200&h=630&fit=crop&q=80',
    'https://images.unsplash.com/photo-1518458028785-8fbcd101ebb9?w=1200&h=630&fit=crop&q=80',
    'https://images.unsplash.com/photo-1416342504532-87a4cac2b4c4?w=1200&h=630&fit=crop&q=80',
    'https://images.unsplash.com/photo-1568667256549-094345857637?w=1200&h=630&fit=crop&q=80',
    'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=1200&h=630&fit=crop&q=80',
    'https://images.unsplash.com/photo-1633409361618-c73427e4e206?w=1200&h=630&fit=crop&q=80',
    'https://images.unsplash.com/photo-1611348586804-61bf6c080437?w=1200&h=630&fit=crop&q=80',
    'https://images.unsplash.com/photo-1554224154-22dec7ec8818?w=1200&h=630&fit=crop&q=80',
    'https://images.unsplash.com/photo-1543333995-a78d9e35e1b9?w=1200&h=630&fit=crop&q=80',
    'https://images.unsplash.com/photo-1592833159949-9db974d69730?w=1200&h=630&fit=crop&q=80',
    'https://images.unsplash.com/photo-1606868306217-dbf5046868d2?w=1200&h=630&fit=crop&q=80',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1200&h=630&fit=crop&q=80',
    'https://images.unsplash.com/photo-1543168256-418811576931?w=1200&h=630&fit=crop&q=80',
  ],
  [ArticleCategory.SELLING_GUIDE]: [
    // For sale signs, handshakes, property viewings, real estate
    'https://images.unsplash.com/photo-1560520653-9e0e4c89eb11?w=1200&h=630&fit=crop&q=80',
    'https://images.unsplash.com/photo-1556761175-4b46a572b786?w=1200&h=630&fit=crop&q=80',
    'https://images.unsplash.com/photo-1521791136064-7986c2920216?w=1200&h=630&fit=crop&q=80',
    'https://images.unsplash.com/photo-1516156008625-3a9d6067fab5?w=1200&h=630&fit=crop&q=80',
    'https://images.unsplash.com/photo-1593672715438-d88a70629abe?w=1200&h=630&fit=crop&q=80',
    'https://images.unsplash.com/photo-1626178793926-22b28830aa30?w=1200&h=630&fit=crop&q=80',
    'https://images.unsplash.com/photo-1571079977755-4083a66e09d0?w=1200&h=630&fit=crop&q=80',
    'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&h=630&fit=crop&q=80',
    'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=1200&h=630&fit=crop&q=80',
    'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1200&h=630&fit=crop&q=80',
    'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=1200&h=630&fit=crop&q=80',
    'https://images.unsplash.com/photo-1556912173-3bb406ef7e77?w=1200&h=630&fit=crop&q=80',
    'https://images.unsplash.com/photo-1571055107559-3e67626fa8be?w=1200&h=630&fit=crop&q=80',
    'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=1200&h=630&fit=crop&q=80',
    'https://images.unsplash.com/photo-1509660933844-6910e12765a0?w=1200&h=630&fit=crop&q=80',
    'https://images.unsplash.com/photo-1593696140826-c58b021acf8b?w=1200&h=630&fit=crop&q=80',
    'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=1200&h=630&fit=crop&q=80',
    'https://images.unsplash.com/photo-1505843513577-22bb7d21e455?w=1200&h=630&fit=crop&q=80',
    'https://images.unsplash.com/photo-1591117207239-788bf8de6c3b?w=1200&h=630&fit=crop&q=80',
    'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=1200&h=630&fit=crop&q=80',
    'https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=1200&h=630&fit=crop&q=80',
    'https://images.unsplash.com/photo-1589654529662-9cfe3e4bf493?w=1200&h=630&fit=crop&q=80',
    'https://images.unsplash.com/photo-1600607686527-6fb886090705?w=1200&h=630&fit=crop&q=80',
    'https://images.unsplash.com/photo-1613545325278-f24b0cae1224?w=1200&h=630&fit=crop&q=80',
    'https://images.unsplash.com/photo-1582795479174-3a7c825c3db5?w=1200&h=630&fit=crop&q=80',
  ],
  [ArticleCategory.NEW_LAUNCH_REVIEW]: [
    // Modern condos, new developments, construction, luxury buildings - UPDATED FOR SINGAPORE PROPERTIES
    'https://images.unsplash.com/photo-kNzqXxlvmE4?w=1200&h=630&fit=crop&q=80', // Construction crane with apartments (FREE)
    'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1200&h=630&fit=crop&q=80',
    'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=1200&h=630&fit=crop&q=80',
    'https://images.unsplash.com/photo-1567684014761-b65e2e59b9eb?w=1200&h=630&fit=crop&q=80',
    'https://images.unsplash.com/photo-1555636222-cae831534b7b?w=1200&h=630&fit=crop&q=80',
    'https://images.unsplash.com/photo-1615873968403-89e068629265?w=1200&h=630&fit=crop&q=80',
    'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=1200&h=630&fit=crop&q=80',
    'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1200&h=630&fit=crop&q=80',
    'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200&h=630&fit=crop&q=80',
    'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=1200&h=630&fit=crop&q=80',
    'https://images.unsplash.com/photo-1524634126442-357e0eac3c14?w=1200&h=630&fit=crop&q=80',
    'https://images.unsplash.com/photo-1508964942454-1a56651d54ac?w=1200&h=630&fit=crop&q=80',
    'https://images.unsplash.com/photo-1565967511849-76a60a516170?w=1200&h=630&fit=crop&q=80',
    'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&h=630&fit=crop&q=80',
    'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=1200&h=630&fit=crop&q=80',
    'https://images.unsplash.com/photo-1589998059171-988d887df646?w=1200&h=630&fit=crop&q=80',
    'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=1200&h=630&fit=crop&q=80',
    'https://images.unsplash.com/photo-1503652601-557d07733ddc?w=1200&h=630&fit=crop&q=80',
    'https://images.unsplash.com/photo-1515263487990-61b07816b924?w=1200&h=630&fit=crop&q=80',
    'https://images.unsplash.com/photo-1502016251346-3d0147c2a51b?w=1200&h=630&fit=crop&q=80',
    'https://images.unsplash.com/photo-1593739735363-8a40ffe3ba93?w=1200&h=630&fit=crop&q=80',
    'https://images.unsplash.com/photo-1571623100940-0ea6d6ea96bd?w=1200&h=630&fit=crop&q=80',
    'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=1200&h=630&fit=crop&q=80',
    'https://images.unsplash.com/photo-1558090353-0ecbc9d88ef8?w=1200&h=630&fit=crop&q=80',
    'https://images.unsplash.com/photo-1587926386166-6b2b8c03e1f8?w=1200&h=630&fit=crop&q=80',
  ],
  [ArticleCategory.LOCATION_GUIDE]: [
    // Singapore landmarks, districts, neighborhoods, transport
    'https://images.unsplash.com/photo-1519897831810-a9a01aceccd1?w=1200&h=630&fit=crop&q=80',
    'https://images.unsplash.com/photo-1609924211018-5526c55bad5b?w=1200&h=630&fit=crop&q=80',
    'https://images.unsplash.com/photo-1533628635777-112b2239b1c7?w=1200&h=630&fit=crop&q=80',
    'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=1200&h=630&fit=crop&q=80',
    'https://images.unsplash.com/photo-1596402184320-417e7178b2cd?w=1200&h=630&fit=crop&q=80',
    'https://images.unsplash.com/photo-1527066579998-dbbae57b9ca2?w=1200&h=630&fit=crop&q=80',
    'https://images.unsplash.com/photo-1555212697-194d092e3b8f?w=1200&h=630&fit=crop&q=80',
    'https://images.unsplash.com/photo-1569288063643-5d29ad64df09?w=1200&h=630&fit=crop&q=80',
    'https://images.unsplash.com/photo-1565967511849-76a60a516170?w=1200&h=630&fit=crop&q=80',
    'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=1200&h=630&fit=crop&q=80',
    'https://images.unsplash.com/photo-1496307653780-42ee777d4833?w=1200&h=630&fit=crop&q=80',
    'https://images.unsplash.com/photo-1547919307-1ecb10702e6f?w=1200&h=630&fit=crop&q=80',
    'https://images.unsplash.com/photo-1555217851-6141535bd771?w=1200&h=630&fit=crop&q=80',
    'https://images.unsplash.com/photo-1542370285-b8eb8317691c?w=1200&h=630&fit=crop&q=80',
    'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=1200&h=630&fit=crop&q=80',
    'https://images.unsplash.com/photo-1567157577867-05ccb1388e66?w=1200&h=630&fit=crop&q=80',
    'https://images.unsplash.com/photo-1571059530264-d5b55bdf7755?w=1200&h=630&fit=crop&q=80',
    'https://images.unsplash.com/photo-1571059409994-b46af7efd1d1?w=1200&h=630&fit=crop&q=80',
    'https://images.unsplash.com/photo-1484804959297-65e7c19d7c9f?w=1200&h=630&fit=crop&q=80',
    'https://images.unsplash.com/photo-1560707303-4e980ce876ad?w=1200&h=630&fit=crop&q=80',
    'https://images.unsplash.com/photo-1548440062-b6c66c25b8f4?w=1200&h=630&fit=crop&q=80',
    'https://images.unsplash.com/photo-1529408632839-a54952c491e5?w=1200&h=630&fit=crop&q=80',
    'https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?w=1200&h=630&fit=crop&q=80',
    'https://images.unsplash.com/photo-1486335370669-e92ed244026e?w=1200&h=630&fit=crop&q=80',
    'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=1200&h=630&fit=crop&q=80',
    'https://images.unsplash.com/photo-1556739227-bd9d9e4f0e05?w=1200&h=630&fit=crop&q=80',
  ]
}

export class ImageSelector {
  
  static async getUniqueImage(category: ArticleCategory): Promise<string> {
    // Get available images for this category
    const categoryImages = PROPERTY_IMAGES[category] || PROPERTY_IMAGES[ArticleCategory.MARKET_INSIGHTS]
    
    // Get recently used images from database
    const recentImages = await this.getRecentlyUsedImages()
    
    // Filter out recently used images
    const availableImages = categoryImages.filter(img => !recentImages.includes(img))
    
    // If all images have been used, select from full pool
    const imagesToSelect = availableImages.length > 0 ? availableImages : categoryImages
    
    // Random selection
    const selectedImage = imagesToSelect[Math.floor(Math.random() * imagesToSelect.length)]
    
    return selectedImage
  }

  private static async getRecentlyUsedImages(): Promise<string[]> {
    try {
      // Skip database check during build
      if (typeof window === 'undefined' && process.env.NODE_ENV === 'production' && !process.env.DATABASE_URL) {
        return []
      }
      
      // Import prisma only when needed to avoid build issues
      const { prisma } = await import('@/lib/prisma')
      
      // Get last 15 article images
      const recentArticles = await prisma.article.findMany({
        select: { featuredImage: true },
        orderBy: { createdAt: 'desc' },
        take: 15
      })
      
      return recentArticles.map(article => article.featuredImage).filter((image): image is string => Boolean(image))
    } catch (error) {
      console.warn('Could not fetch recent images from database:', error)
      return []
    }
  }

  // For getting images based on specific topics
  static async getTopicBasedImage(topic: string, category: ArticleCategory): Promise<string> {
    // Keywords to image mapping for better relevance
    const topicKeywords: { [key: string]: string[] } = {
      'cny': ['chinese', 'festival', 'red', 'celebration'],
      'national day': ['singapore', 'flag', 'skyline', 'celebration'],
      'school': ['education', 'family', 'children', 'neighborhood'],
      'investment': ['finance', 'money', 'chart', 'analysis'],
      'hdb': ['public', 'housing', 'flat', 'singapore'],
      'condo': ['luxury', 'modern', 'condominium', 'facilities'],
      'cooling': ['policy', 'government', 'regulation', 'document'],
      'market': ['trend', 'analysis', 'cityscape', 'business'],
    }

    // Check if topic matches any keyword set
    const lowerTopic = topic.toLowerCase()
    for (const [keyword, relatedTerms] of Object.entries(topicKeywords)) {
      if (lowerTopic.includes(keyword) || relatedTerms.some(term => lowerTopic.includes(term))) {
        // Try to find a more specific image category
        if (keyword === 'investment') return this.getUniqueImage(ArticleCategory.INVESTMENT)
        if (keyword === 'school') return this.getUniqueImage(ArticleCategory.NEIGHBORHOOD)
        if (keyword === 'cooling') return this.getUniqueImage(ArticleCategory.PROPERTY_NEWS)
      }
    }

    // Default to category-based selection
    return this.getUniqueImage(category)
  }
}