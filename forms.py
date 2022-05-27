from flask_wtf import FlaskForm
from datetime import datetime
from wtforms import StringField, IntegerField, RadioField, DateTimeField, SelectField 
from wtforms.validators import InputRequired, Optional
from static.offenses import offenses

offenses_spaced = [offense.replace('-', ' ') for offense in offenses]
offenses_labels = [offense.title() for offense in offenses_spaced]
offenses_tuples = [(offenses[n], offenses_labels[n]) for n in range(len(offenses))]

class QueryForm(FlaskForm) :
    """Specifies query details for api call"""

    offense = SelectField('Choose Crime', choices=offenses_tuples)
    info = SelectField('Info About', choices=[('victim', 'Victim Demographics'), ('offense', 'Crimes')])
    data = SelectField('Choose Data', validate_choice=False, choices=[('age', 'Age'), ('relationship', 'Relationship'), ('count', 'Count'), ('ethnicity', 'Ethnicity'), ('race', 'Race'), ('sex', 'Sex')])
    scope = SelectField('Scope', choices=[('national', 'National'), ('regions', 'Regional'), ('states', 'State Level'), ('agencies', 'Agency-specific')])
    location = SelectField('Location', validate_choice=False, choices=[('', '-')])

