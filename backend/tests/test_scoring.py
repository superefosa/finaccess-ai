from app.services.scoring import recommendation_from_score


def test_recommendation_thresholds():
    assert recommendation_from_score(0.2) == "approve"
    assert recommendation_from_score(0.5) == "review"
    assert recommendation_from_score(0.8) == "reject"
