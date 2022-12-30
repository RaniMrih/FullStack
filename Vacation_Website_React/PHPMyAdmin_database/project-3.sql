-- phpMyAdmin SQL Dump
-- version 4.8.5
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jul 29, 2019 at 02:38 PM
-- Server version: 10.1.38-MariaDB
-- PHP Version: 7.3.3

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `project-3`
--

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `first_name` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `last_name` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `user_name` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `password` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `role` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `first_name`, `last_name`, `user_name`, `password`, `role`) VALUES
(1, 'Rani', 'Mrih', 'RM', '1234', 1),
(2, 'AAA', 'AAA', 'AAA', '1234', 0),
(3, 'BBB', 'BBB', 'BBB', '1234', 0),
(4, 'CCC', 'CCC', 'CCC', '1234', 0);

-- --------------------------------------------------------

--
-- Table structure for table `users_vacation`
--

CREATE TABLE `users_vacation` (
  `id` int(11) NOT NULL,
  `uId` int(11) NOT NULL,
  `location` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `users_vacation`
--

INSERT INTO `users_vacation` (`id`, `uId`, `location`) VALUES
(283, 2, 'Paris'),
(308, 4, 'Thailand'),
(309, 4, 'Paris'),
(310, 4, 'Barcelona'),
(312, 3, 'Barcelona'),
(313, 3, 'Rome'),
(314, 3, 'London'),
(316, 3, 'Berlin'),
(317, 3, 'New York'),
(318, 3, 'Thailand'),
(319, 3, 'Istanbul');

-- --------------------------------------------------------

--
-- Table structure for table `vacation`
--

CREATE TABLE `vacation` (
  `id` int(11) NOT NULL,
  `title` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `location` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `image` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `start_date` varchar(255) NOT NULL,
  `end_date` varchar(255) NOT NULL,
  `price` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `vacation`
--

INSERT INTO `vacation` (`id`, `title`, `location`, `image`, `start_date`, `end_date`, `price`) VALUES
(2, 'Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus terry richardson ad squid. Nihil anim', 'Barcelona', 'https://www.fodors.com/wp-content/uploads/2018/07/shutterstock_552368572.jpg', '5/8/2019', '10/8/2019', 200),
(3, 'Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus terry richardson ad squid. Nihil anim', 'Paris', 'https://www.fodors.com/wp-content/uploads/2018/10/HERO_UltimateParis_Heroshutterstock_112137761.jpg\r\n', '1/9/2019', '10/9/2019', 400),
(5, 'Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus terry richardson ad squid. Nihil anim', 'Rome', 'https://images.musement.com/cover/0001/21/rome-hop-on-hop-off-bus-tour-24-48-72-hour-tickets_header-20686.jpeg?w=1200&h=630&q=60&fit=crop\r\n', '16/10/2019', '23/10/2019', 500),
(6, 'Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus terry richardson ad squid. Nihil anim', 'London', 'https://cdn.londonandpartners.com/visit/general-london/areas/river/76709-640x360-houses-of-parliament-and-london-eye-on-thames-from-above-640.jpg', '19/11/2019', '27/11/2019', 300),
(7, 'Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus terry richardson ad squid. Nihil anim', 'Thailand', 'https://www.hootholidays.com.au/media/catalog/category/Thailand-Banner.jpg', '21/9/2019', '27/9/2019', 200),
(8, 'Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus terry richardson ad squid. Nihil anim', 'Amsterdam', 'https://t4.ftcdn.net/jpg/02/07/76/35/500_F_207763527_0jV4hh7dIfEpGqffLPXKZa5obVGynqXe.jpg', '15/8/2019', '19/8/2019', 300),
(9, 'Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus terry richardson ad squid. Nihil anim', 'Berlin', 'https://www.telegraph.co.uk/content/dam/Travel/Destinations/Europe/Germany/Berlin/berlin-guide-lead-2018.jpg?imwidth=450', '23/10/2019', '1/1/2020', 400),
(10, 'Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus terry richardson ad squid. Nihil anim', 'New York', 'https://www.telegraph.co.uk/content/dam/Travel/Destinations/North%20America/USA/New%20York/Attractions/statue-of-liberty-new-york-p.jpg?imwidth=450', '29/11/2019', '4/12/2019', 1200),
(11, 'Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus terry richardson ad squid. Nihil anim', 'Istanbul', 'https://cdn.thecrazytourist.com/wp-content/uploads/2018/06/ccimage-shutterstock_428804917.jpg', '20/11/2019', '29/11/2019', 300),
(12, 'Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus terry richardson ad squid. Nihil anim', 'Portugal', 'https://mansion-global-app.s3.amazonaws.com/stories/portugal-special-report-round-up/media/portugalroundup_lead-mr.jpg', '1/11/2019', '15/11/2019', 800),
(13, 'Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus terry richardson ad squid. Nihil anim', 'Tokyo', 'https://savvytokyo.scdn3.secure.raxcdn.com/app/uploads/2018/07/jezael-melgoza-748008-unsplash-e1532595208714.jpg', '2/1/2020', '20/1/2020', 1500),
(14, 'Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus terry richardson ad squid. Nihil anim', 'China', 'https://news.bitcoin.com/wp-content/uploads/2019/03/china-ranking-11.png', '3/2/2020', '3/3/2020', 1500);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users_vacation`
--
ALTER TABLE `users_vacation`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `vacation`
--
ALTER TABLE `vacation`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `users_vacation`
--
ALTER TABLE `users_vacation`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=320;

--
-- AUTO_INCREMENT for table `vacation`
--
ALTER TABLE `vacation`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
