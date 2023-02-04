import React, { useState, useRef } from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import WriteReviewStarRating from './WriteReviewStarRating.jsx';
import CharacteristicRadioButtons from './CharacteristicRadioButtons.jsx';
import UploadAndDisplayImage from './WriteReviewUploadImage.jsx';
import SubmitReview from './SubmitReview.jsx';

export default function WriteReviewModal({ setWriteModal, feature, reviewMeta }) {
  // STATE DATA
  const [starRatingText, setStarRatingText] = useState('');
  const [summaryCount, setSummaryCount] = useState(0);
  const [bodyCount, setBodyCount] = useState(0);
  const [imageUploadModal, setImageUploadModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState([]);
  const summaryRef = useRef();
  const bodyRef = useRef();
  const [submitReview, setSubmitReview] = useState({
    product_id: feature.id,
    rating: 1,
    summary: 'this is a test summary', // done
    body: 'this has to be at least 50 characters so ill keep typing for a while', // done
    recommend: false, // done
    name: 'erik', // done
    email: 'erik1234@gmail.com', // done // done
    photos: [],
    characteristics: {Size: 1, Width: 1, Comfort: 1, Quality: 1},
  });

  // EVENT HANDLERS // Needs beeter functionality to exit Modal w/o Mouse
  const closeModal = (e) => {
    if (e.key === 'Escape' || e.type === 'Click') {
      setWriteModal(false);
    }
    setWriteModal(false);
  };
  const starRatingTextHandler = (value) => {
    if (value === 1) {
      setStarRatingText('Poor');
      setSubmitReview({ ...submitReview, rating: value });
    }
    if (value === 2) {
      setStarRatingText('Fair');
      setSubmitReview({ ...submitReview, rating: value });
    }
    if (value === 3) {
      setStarRatingText('Average');
      setSubmitReview({ ...submitReview, rating: value });
    }
    if (value === 4) {
      setStarRatingText('Good');
      setSubmitReview({ ...submitReview, rating: value });
    }
    if (value === 5) {
      setStarRatingText('Great');
      setSubmitReview({ ...submitReview, rating: value });
    }
  };
  const handleSummaryChange = (e) => {
    setSummaryCount(e.target.value.length);
    setSubmitReview({ ...submitReview, summary: e.target.value });
  };
  const handleBodyChange = (e) => {
    setBodyCount(e.target.value.length);
    setSubmitReview({ ...submitReview, body: e.target.value });
  };
  const handleRecommendation = (e) => {
    const { value } = e.target;
    setSubmitReview({
      ...submitReview,
      recommend: value === 'yes',
    });
  };
  const handleNameChange = (e) => {
    setSubmitReview({ ...submitReview, name: e.target.value });
  };
  const handleEmailChange = (e) => {
    setSubmitReview({ ...submitReview, email: e.target.value });
  };

  return ReactDOM.createPortal((
    <div className="write-review-modal">{console.log(submitReview)}
      <div className="write-review-modal-parent" style={{position: 'relative'}}>
        <p>Write your review</p>
        <p>About {feature.name}</p>
        <div style={{display: 'flex'}}> {/*Rename and Refactor */}
          <WriteReviewStarRating
            onChange={starRatingTextHandler}
          />
          <p>{starRatingText}</p>
        </div>
        <div>
          <p>Do you recommend this product?</p>
          <label htmlFor="recommendation-yes">
            <input type="radio" name="recommendation-yes" value="yes" onChange={handleRecommendation} />
            Yes
          </label>
          <label htmlFor="recommendation-no">
            <input type="radio" name="recommendation-no" value="no" onChange={handleRecommendation} />
            No
          </label>
        </div>
        <div>
          <p>Tell us more...</p>
          {reviewMeta
            ? (
              <CharacteristicRadioButtons
                reviewMeta={reviewMeta}
                setSubmitReview={setSubmitReview}
                submitReview={submitReview}
              />
            ) : null}
        </div>
        <div style={{display: 'flex', flexDirection: 'column'}}>
          <p style={{textAlign: 'center', marginBottom: '2rem'}}>Review Summary</p>
          <textarea ref={summaryRef} maxLength="60" placeholder="Example: Best purchase ever!" className="write-review-summary" onChange={handleSummaryChange} />
          {summaryCount
            ? (
              <p className="write-review-character-count">
                Character Count:
                {summaryCount}
              </p>
            )
            : <br />}
        </div>
        <div style={{display: 'flex', flexDirection: 'column'}}>
          <p style={{textAlign: 'center', marginBottom: '2rem'}}>Write your review below</p>
          <textarea ref={bodyRef} maxLength="1000" placeholder="Why did you like the product?" className="write-review-summary" onChange={handleBodyChange} />
          <p className="write-review-character-count">
            {bodyCount >= 50
              ? 'Minimum Reached!'
              : `Minimum required characters left: ${50 - bodyCount}`}
          </p>
        </div>
        <br />
        <br />
        <div className="write-review-email-parent">
          <div className="form__group field">
            <input type="input" className="form__field" placeholder="nickname" name="nickname" id="nickname" maxLength="60" onChange={handleNameChange} required />
            <label htmlFor="nickname" className="form__label">Nickname</label>
          </div>
          <p style={{fontSize: '0.75rem', fontStyle: 'italic'}}>For privacy reasons, do not use your full name or email address</p>
        </div>
        <div className="write-review-email-parent">
          <div className="form__group field">
            <input type="input" className="form__field" placeholder="Name" name="name" id="name" maxLength="60" onChange={handleEmailChange} required />
            <label htmlFor="name" className="form__label">Email</label>
          </div>
          <p style={{fontSize: '0.75rem', fontStyle: 'italic'}}>For authentication reasons, you will not be emailed</p>
        </div>
        <div>
          <SubmitReview submitReview={submitReview} />
        </div>
        <button type="button" onClick={() => setImageUploadModal(true)} style={{position: 'sticky', bottom: '0', fontSize: ".7rem", borderRadius: "25%"}}>
          Upload
          <br />
          Your
          <br />
          Pics!
        </button>
        {imageUploadModal
          ? (
            <UploadAndDisplayImage
              setImageUploadModal={setImageUploadModal}
              setSelectedImage={setSelectedImage}
              selectedImage={selectedImage}
              setSubmitReview={setSubmitReview}
              submitReview={submitReview}
            />
          ) : null}
      </div>
    </div>), document.getElementById('modal'));
}


// onClick={ (e) => closeModal(e)}