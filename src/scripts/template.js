import { showFormattedDate } from "./utils";

export function generateUnauthenticatedNavigationListTemplate() {
  return `
    <li id="push-notification-tools" class="push-notification-tools"></li>
    <li><a id="login-button" href="#/login">Login</a></li>
    <li><a id="register-button" href="#/register">Register</a></li>
  `;
}

export function generateAuthenticatedNavigationListTemplate() {
  return `
    <li id="push-notification-tools" class="push-notification-tools"></li>
    <li><a id="new-report-button" class="btn new-report-button" href="#/add">Buat Cerita<i class="fas fa-plus"></i></a></li>
    <li><a id="logout-button" class="logout-button" href="#/logout"><i class="fas fa-sign-out-alt"></i> Logout</a></li>
  `;
}

export function generateStoryCardTemplate({
  id,
  name,
  description,
  photoUrl,
  createdAt,
  lat,
  lon,
}) {
  return `
    <div tabindex="0" data-storyid=${id} class="card">
          <img class="card-image" src="${photoUrl}" alt="${name}" />
          <div class="card-content">
            <h3 class="card-title">${name}</h3>
            <p class="card-description">${description}</p>
            <div class="card-metadata">
              <span>Posted: ${showFormattedDate(createdAt)}</span>
            </div>
            <div class="card-location">
              <span class="card-location-icon">📍</span>
              <span>${lat}° N, ${lon}° W</span>
            </div>
            <a href='#/stories/${id}' class="card-button">View Details</a>
          </div>
        </div>
  `;
}

export function generateStoryEmptyTemplate() {
  return `
    <div class="empty-state">
      <h2>No Stories Available</h2>
      <p>Looks like there are no stories to show. Please check back later.</p>
    </div>
  `;
}

export function generateStoryListErrorTemplate() {
  return `
    <div class="error-state">
      <h2>Failed to Load Stories</h2>
      <p>There was an error loading the stories. Please try again later.</p>
    </div>
  `;
}

// export function generateStoryDetailTemplate({
//   name,
//   description,
//   photoUrl,
//   createdAt,
//   lat,
//   lon,
// }) {
//   return `
//     <div class="story-detail">
//       <img class="story-detail-image" src="${photoUrl}" alt="${name}" />
//       <div class="story-detail-content">
//         <h2 class="story-detail-title">${name}</h2>
//         <p class="story-detail-description">${description}</p>
//         <div class="story-detail-metadata">
//           <span>Posted: ${showFormattedDate(createdAt)}</span>
//         </div>
//         <div class="story-detail-location">
//           <span class="story-detail-location-icon">📍</span>
//           <span>${lat}° N, ${lon}° W</span>
//         </div>
//       </div>
//     </div>
//   `;
// }

export function generateStoryDetailTemplate({
  id,
  name,
  description,
  photo,
  createdAt,
  lat,
  lon,
}) {
  return `
    <div class="detail-image" style="background-image: url('${photo}')"></div>
    <div class="detail-content">
      <h2 class="detail-title">${name}</h2>
      <p class="detail-description">${description}</p>
      <div class="detail-meta">Dibuat pada: ${new Date(
        createdAt
      ).toLocaleString()}</div>
      <div class="detail-location">
        <span>📍 Lokasi:</span> ${lat}, ${lon}
      </div>
      <div class="report-detail__body__map__container">
          <h2 class="report-detail__map__title">Peta Lokasi</h2>
          <div class="report-detail__map__container">
            <div id="map" class="report-detail__map"></div>
            <div id="map-loading-container"></div>
          </div>
        </div>
    </div>
  `;
}
