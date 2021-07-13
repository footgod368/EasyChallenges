module Level1Init exposing (init)

{-| Init of Level1 Model.


# init

@docs init

-}

import Array
import Boundary
import Brick
import Browser.Dom exposing (getViewport)
import EndPoint
import Event
import GlobalBasics
import Level1Type
import MainType
import Needle
import NoticeBoard
import Player
import SavePoint
import Task


{-| `init` of Level1 \`Model
-}
init : ( Level1Type.Model, Cmd MainType.Msg )
init =
    let
        newModel =
            { windowBoundary = ( 1000.0, 800.0 )
            , levelBoundary = ( 2000.0, 680.0 )
            , actEvent = Array.fromList []
            , event =
                Array.fromList
                    [
                    Event.init
                        { id = 1, name = "first falling ground" }
                        Event.StartActivated
                        (Event.PlayerCollide
                            (GlobalBasics.Polygon
                                (Array.fromList
                                    [ ( GlobalBasics.blockPos(6,1), GlobalBasics.blockPos(6,15) )
                                    ]
                                )
                            )
                        )
                        (Event.quickDuration 10)
                    ,Event.init
                        { id = 2, name = "first ?" }
                        Event.StartActivated
                        (Event.PlayerCollide
                            ( GlobalBasics.Polygon (Array.fromList [((560,490),(600,490))]))
                        )
                        (Event.quickDuration 10)
                    ,Event.init
                        {id = 3, name = "first falling needles"}
                        Event.StartActivated
                        (Event.PlayerCollide
                            ( GlobalBasics.Polygon (Array.fromList [(GlobalBasics.blockPos (23,13),GlobalBasics.blockPos (23,20))]))
                        )
                        (Event.quickDuration 10)
                    ,Event.init
                        {id = 4, name = "second ?"}
                        Event.StartActivated
                        (Event.PlayerCollide
                            ( GlobalBasics.Polygon (Array.fromList [(GlobalBasics.blockPos (24,10),GlobalBasics.blockPos (25,10))]))
                        )
                        (Event.quickDuration 10)
                    ,Event.init
                        {id = 5, name = "fisrt hidden brick"}
                        Event.StartActivated
                        (Event.PlayerCollide
                            ( Brick.quickCollisionBox (4.5,12) Brick.NormalAppearance)
                        )
                        (Event.quickDuration 10)
                    ,Event.init
                        {id = 6, name = "second hidden brick"}
                        Event.StartActivated
                        (Event.PlayerCollide
                            ( Brick.quickCollisionBox (5.5,12) Brick.NormalAppearance)
                        )
                        (Event.quickDuration 10)
                    ,Event.init
                        {id = 7, name = "third hidden brick"}
                        Event.StartActivated
                        (Event.PlayerCollide
                            ( Brick.quickCollisionBox (32.5,12) Brick.NormalAppearance)
                        )
                        (Event.quickDuration 10)
                    ,Event.init
                        {id = 8, name = "fourth hidden brick"}
                        Event.StartActivated
                        (Event.PlayerCollide
                            ( Brick.quickCollisionBox (33.5,12) Brick.NormalAppearance)
                        )
                        (Event.quickDuration 10)
                    ,Event.init
                        {id = 9, name = "first hidden needles"}
                        Event.StartActivated
                        (Event.PlayerCollide
                            ( GlobalBasics.Polygon (Array.fromList [ ( GlobalBasics.blockPos_ (31,9.26),GlobalBasics.blockPos_ (37,9.26) ) ]))
                        )
                        (Event.quickDuration 10)
                    ]

            , boundary = Boundary.normalInit
            , player = Player.init ( 50.0, 490.0 )
            , bricks =
                Array.fromList
                    (List.concat
                        [ 
                            Brick.quickBrickRow 15 1 4
                        ,   Brick.fallingRow 15 5 8 1
                        ,   Brick.quickBrickRow 15 9 32
                        ,   Brick.quickBrickRow 12 22 26
                        ,   [Brick.quickInit (GlobalBasics.blockPos (15,12))]
                        ,   [Brick.quickInit (GlobalBasics.blockPos (24,9))]
                        ,   [Brick.hidden_ (25,9) 4
                            ,Brick.hidden_ (26,9) 4
                            ,Brick.hidden_ (26,10) 4
                            ,Brick.hidden_ (26,11) 4
                            ,Brick.hidden_ (23,9) 4
                            ,Brick.hidden_ (22,9) 4
                            ,Brick.hidden_ (22,10) 4
                            ,Brick.hidden_ (22,11) 4]
                        ,    [Brick.hidden (4.5,12) 5
                            , Brick.hidden (5.5,12) 6]
                        ,   Brick.quickBrickRow 15 36 46
                        ,   NoticeBoard.boundary (31,5) (7,4)
                        ,   [Brick.hidden (32.5,12) 7
                            , Brick.hidden (33.5,12) 8]
                        ]
                        )
            , savePoints =
                Array.fromList [ SavePoint.init (GlobalBasics.blockPos ( 2, 14 ))
                                ,SavePoint.init (GlobalBasics.blockPos ( 41, 14 )) ]
            , endPoint = EndPoint.init (GlobalBasics.blockPos ( 22, 1 ))
            , noticeBoards =
                Array.fromList
                    [                     ]
            , needles =
                Array.fromList
                    (List.concat
                    [         
                        [Needle.quickHidden (15,13) 2]
                    ,   Needle.fallingRow 13 22 26 3
                    ,   [Needle.quickHidden_ (25,12) 4]
                    ,   Needle.hiddenRow 9 31 37 9
                    ])
            , keyPressed = []
            }
    in
    ( newModel, Task.perform MainType.GetViewport getViewport )
