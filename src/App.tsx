/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import About from './pages/About';
import Marketplace from './pages/Marketplace';
import Wholesale from './pages/Wholesale';
import ProductDetail from './pages/ProductDetail';

import Activities from './pages/Activities';
import ActivityDetail from './pages/ActivityDetail';
import Projects from './pages/Projects';
import ProjectDetail from './pages/ProjectDetail';
import Sites from './pages/Sites';
import CommercialForms from './pages/CommercialForms';
import MediathequeImages from './pages/MediathequeImages';
import MediathequeVideos from './pages/MediathequeVideos';
import News from './pages/News';
import NewsDetail from './pages/NewsDetail';
import Contact from './pages/Contact';
import PartnerForm from './pages/PartnerForm';
import PlaceholderPage from './pages/PlaceholderPage';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="marketplace" element={<Marketplace />} />
          <Route path="product/:id" element={<ProductDetail />} />
          <Route path="wholesale" element={<Wholesale />} />
          <Route path="nos-activites" element={<Activities />} />
          <Route path="nos-activites/:id" element={<ActivityDetail />} />
          <Route path="projets" element={<Projects />} />
          <Route path="projet/:id" element={<ProjectDetail />} />
          <Route path="sites-de-production" element={<Sites />} />
          <Route path="espace-commercial" element={<CommercialForms />} />
          <Route path="mediatheque/images" element={<MediathequeImages />} />
          <Route path="mediatheque/videos" element={<MediathequeVideos />} />
          <Route path="actualite" element={<News />} />
          <Route path="actualite/:id" element={<NewsDetail />} />
          <Route path="contact" element={<Contact />} />
          <Route path="devenir-partenaire" element={<PartnerForm />} />
          <Route path="login" element={<PlaceholderPage title="Sign In" />} />
          <Route path="signup" element={<PlaceholderPage title="Create Account" />} />
        </Route>

      </Routes>
    </Router>
  );
}
